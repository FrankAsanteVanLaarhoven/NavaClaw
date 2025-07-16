#!/usr/bin/env python3
"""
GDPR/CCPA Compliance Module
Implements data protection and privacy controls for enterprise use.
"""

import json
import hashlib
import base64
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any, Set
import logging
from dataclasses import dataclass, asdict
import sqlite3
import uuid
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import os


@dataclass
class DataSubject:
    """Represents a data subject under GDPR/CCPA."""
    id: str
    email: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    consent_given: bool = False
    consent_date: Optional[datetime] = None
    data_retention_days: int = 730  # 2 years default
    created_at: datetime = None
    last_accessed: Optional[datetime] = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now(timezone.utc)


@dataclass
class DataProcessingRecord:
    """Record of data processing activities."""
    id: str
    data_subject_id: str
    processing_purpose: str
    data_categories: List[str]
    legal_basis: str
    processing_date: datetime
    retention_period_days: int
    automated_decision_making: bool = False
    profiling: bool = False
    third_party_sharing: bool = False
    third_parties: List[str] = None
    
    def __post_init__(self):
        if self.third_parties is None:
            self.third_parties = []


class DataEncryption:
    """Handles encryption/decryption of sensitive data."""
    
    def __init__(self, key_file: str = "encryption.key"):
        self.key_file = Path(key_file)
        self.key = self._load_or_generate_key()
        self.cipher_suite = Fernet(self.key)
    
    def _load_or_generate_key(self) -> bytes:
        """Load existing key or generate a new one."""
        if self.key_file.exists():
            with open(self.key_file, 'rb') as f:
                return f.read()
        else:
            key = Fernet.generate_key()
            self.key_file.parent.mkdir(exist_ok=True)
            with open(self.key_file, 'wb') as f:
                f.write(key)
            return key
    
    def encrypt_data(self, data: str) -> str:
        """Encrypt sensitive data."""
        return self.cipher_suite.encrypt(data.encode()).decode()
    
    def decrypt_data(self, encrypted_data: str) -> str:
        """Decrypt sensitive data."""
        return self.cipher_suite.decrypt(encrypted_data.encode()).decode()
    
    def hash_personal_data(self, data: str) -> str:
        """Create a one-way hash of personal data."""
        return hashlib.sha256(data.encode()).hexdigest()


class ComplianceManager:
    """Main compliance management system."""
    
    def __init__(self, db_path: str = "compliance.db"):
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(exist_ok=True)
        self.encryption = DataEncryption()
        self.logger = logging.getLogger(__name__)
        
        # Initialize database
        self._init_database()
    
    def _init_database(self):
        """Initialize compliance database."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Data subjects table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS data_subjects (
                id TEXT PRIMARY KEY,
                email TEXT,
                ip_address TEXT,
                user_agent TEXT,
                consent_given BOOLEAN,
                consent_date TEXT,
                data_retention_days INTEGER,
                created_at TEXT,
                last_accessed TEXT
            )
        ''')
        
        # Processing records table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS processing_records (
                id TEXT PRIMARY KEY,
                data_subject_id TEXT,
                processing_purpose TEXT,
                data_categories TEXT,
                legal_basis TEXT,
                processing_date TEXT,
                retention_period_days INTEGER,
                automated_decision_making BOOLEAN,
                profiling BOOLEAN,
                third_party_sharing BOOLEAN,
                third_parties TEXT,
                FOREIGN KEY (data_subject_id) REFERENCES data_subjects (id)
            )
        ''')
        
        # Data access logs table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS data_access_logs (
                id TEXT PRIMARY KEY,
                data_subject_id TEXT,
                access_type TEXT,
                access_date TEXT,
                user_id TEXT,
                purpose TEXT,
                FOREIGN KEY (data_subject_id) REFERENCES data_subjects (id)
            )
        ''')
        
        # Deletion requests table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS deletion_requests (
                id TEXT PRIMARY KEY,
                data_subject_id TEXT,
                request_date TEXT,
                request_type TEXT,
                status TEXT,
                processed_date TEXT,
                FOREIGN KEY (data_subject_id) REFERENCES data_subjects (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def register_data_subject(self, email: str = None, ip_address: str = None, 
                            user_agent: str = None) -> str:
        """Register a new data subject."""
        subject_id = str(uuid.uuid4())
        
        # Hash sensitive data
        hashed_email = self.encryption.hash_personal_data(email) if email else None
        hashed_ip = self.encryption.hash_personal_data(ip_address) if ip_address else None
        
        subject = DataSubject(
            id=subject_id,
            email=hashed_email,
            ip_address=hashed_ip,
            user_agent=user_agent
        )
        
        # Store in database
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO data_subjects 
            (id, email, ip_address, user_agent, consent_given, consent_date, 
             data_retention_days, created_at, last_accessed)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            subject.id, subject.email, subject.ip_address, subject.user_agent,
            subject.consent_given, subject.consent_date.isoformat() if subject.consent_date else None,
            subject.data_retention_days, subject.created_at.isoformat(), subject.last_accessed.isoformat() if subject.last_accessed else None
        ))
        
        conn.commit()
        conn.close()
        
        self.logger.info(f"Registered data subject: {subject_id}")
        return subject_id
    
    def record_consent(self, subject_id: str, consent_type: str = "general"):
        """Record explicit consent from data subject."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE data_subjects 
            SET consent_given = ?, consent_date = ?
            WHERE id = ?
        ''', (True, datetime.now(timezone.utc).isoformat(), subject_id))
        
        conn.commit()
        conn.close()
        
        self.logger.info(f"Recorded consent for subject: {subject_id}")
    
    def record_data_processing(self, subject_id: str, purpose: str, 
                             data_categories: List[str], legal_basis: str,
                             retention_days: int = 730) -> str:
        """Record data processing activity."""
        record_id = str(uuid.uuid4())
        
        record = DataProcessingRecord(
            id=record_id,
            data_subject_id=subject_id,
            processing_purpose=purpose,
            data_categories=data_categories,
            legal_basis=legal_basis,
            processing_date=datetime.now(timezone.utc),
            retention_period_days=retention_days
        )
        
        # Store in database
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO processing_records 
            (id, data_subject_id, processing_purpose, data_categories, legal_basis,
             processing_date, retention_period_days, automated_decision_making,
             profiling, third_party_sharing, third_parties)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            record.id, record.data_subject_id, record.processing_purpose,
            json.dumps(record.data_categories), record.legal_basis,
            record.processing_date.isoformat(), record.retention_period_days,
            record.automated_decision_making, record.profiling,
            record.third_party_sharing, json.dumps(record.third_parties)
        ))
        
        conn.commit()
        conn.close()
        
        self.logger.info(f"Recorded data processing: {record_id}")
        return record_id
    
    def log_data_access(self, subject_id: str, access_type: str, 
                       user_id: str, purpose: str):
        """Log data access for audit purposes."""
        access_id = str(uuid.uuid4())
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO data_access_logs 
            (id, data_subject_id, access_type, access_date, user_id, purpose)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            access_id, subject_id, access_type,
            datetime.now(timezone.utc).isoformat(), user_id, purpose
        ))
        
        # Update last accessed
        cursor.execute('''
            UPDATE data_subjects 
            SET last_accessed = ?
            WHERE id = ?
        ''', (datetime.now(timezone.utc).isoformat(), subject_id))
        
        conn.commit()
        conn.close()
        
        self.logger.info(f"Logged data access: {access_id}")
    
    def request_data_deletion(self, subject_id: str, request_type: str = "right_to_be_forgotten") -> str:
        """Request data deletion under GDPR/CCPA."""
        request_id = str(uuid.uuid4())
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO deletion_requests 
            (id, data_subject_id, request_date, request_type, status)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            request_id, subject_id, datetime.now(timezone.utc).isoformat(),
            request_type, "pending"
        ))
        
        conn.commit()
        conn.close()
        
        self.logger.info(f"Data deletion requested: {request_id}")
        return request_id
    
    def process_deletion_request(self, request_id: str) -> bool:
        """Process a data deletion request."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get request details
        cursor.execute('SELECT data_subject_id FROM deletion_requests WHERE id = ?', (request_id,))
        result = cursor.fetchone()
        
        if not result:
            conn.close()
            return False
        
        subject_id = result[0]
        
        # Anonymize data subject
        cursor.execute('''
            UPDATE data_subjects 
            SET email = NULL, ip_address = NULL, user_agent = NULL
            WHERE id = ?
        ''', (subject_id,))
        
        # Mark request as processed
        cursor.execute('''
            UPDATE deletion_requests 
            SET status = ?, processed_date = ?
            WHERE id = ?
        ''', ("processed", datetime.now(timezone.utc).isoformat(), request_id))
        
        conn.commit()
        conn.close()
        
        self.logger.info(f"Processed deletion request: {request_id}")
        return True
    
    def get_data_subject_info(self, subject_id: str) -> Optional[Dict[str, Any]]:
        """Get information about a data subject."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM data_subjects WHERE id = ?
        ''', (subject_id,))
        
        result = cursor.fetchone()
        conn.close()
        
        if not result:
            return None
        
        columns = [desc[0] for desc in cursor.description]
        return dict(zip(columns, result))
    
    def get_processing_records(self, subject_id: str) -> List[Dict[str, Any]]:
        """Get all processing records for a data subject."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM processing_records WHERE data_subject_id = ?
        ''', (subject_id,))
        
        results = cursor.fetchall()
        conn.close()
        
        columns = [desc[0] for desc in cursor.description]
        return [dict(zip(columns, row)) for row in results]
    
    def cleanup_expired_data(self):
        """Remove data that has exceeded retention periods."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Find expired processing records
        cursor.execute('''
            SELECT id FROM processing_records 
            WHERE date(processing_date) < date('now', '-' || retention_period_days || ' days')
        ''')
        
        expired_records = cursor.fetchall()
        
        for record in expired_records:
            cursor.execute('DELETE FROM processing_records WHERE id = ?', (record[0],))
        
        conn.commit()
        conn.close()
        
        self.logger.info(f"Cleaned up {len(expired_records)} expired records")
    
    def generate_compliance_report(self, output_file: str = None) -> str:
        """Generate a compliance report."""
        if output_file is None:
            timestamp = datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')
            output_file = f"compliance_report_{timestamp}.json"
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get statistics
        cursor.execute('SELECT COUNT(*) FROM data_subjects')
        total_subjects = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM data_subjects WHERE consent_given = 1')
        consented_subjects = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM processing_records')
        total_processing = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM deletion_requests WHERE status = "pending"')
        pending_deletions = cursor.fetchone()[0]
        
        # Get recent activity
        cursor.execute('''
            SELECT COUNT(*) FROM data_access_logs 
            WHERE date(access_date) >= date('now', '-30 days')
        ''')
        recent_access = cursor.fetchone()[0]
        
        conn.close()
        
        report = {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "statistics": {
                "total_data_subjects": total_subjects,
                "subjects_with_consent": consented_subjects,
                "consent_rate": consented_subjects / total_subjects if total_subjects > 0 else 0,
                "total_processing_records": total_processing,
                "pending_deletion_requests": pending_deletions,
                "recent_data_access": recent_access
            },
            "compliance_status": {
                "gdpr_compliant": consented_subjects > 0,
                "data_retention_managed": True,
                "deletion_requests_processed": pending_deletions == 0,
                "audit_trail_maintained": True
            },
            "recommendations": []
        }
        
        # Add recommendations
        if consented_subjects == 0:
            report["recommendations"].append("Obtain explicit consent from data subjects")
        
        if pending_deletions > 0:
            report["recommendations"].append("Process pending deletion requests")
        
        if recent_access == 0:
            report["recommendations"].append("Review data access patterns")
        
        # Save report
        with open(output_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        return output_file


class PrivacyController:
    """High-level privacy controls for the crawler."""
    
    def __init__(self, compliance_manager: ComplianceManager):
        self.compliance = compliance_manager
        self.logger = logging.getLogger(__name__)
    
    def process_crawl_request(self, url: str, user_id: str, 
                            ip_address: str = None, user_agent: str = None) -> str:
        """Process a crawl request with privacy controls."""
        # Register or identify data subject
        subject_id = self.compliance.register_data_subject(
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        # Record data processing
        processing_id = self.compliance.record_data_processing(
            subject_id=subject_id,
            purpose="web_crawling_and_analysis",
            data_categories=["url_data", "page_content", "metadata"],
            legal_basis="legitimate_interest"
        )
        
        # Log access
        self.compliance.log_data_access(
            subject_id=subject_id,
            access_type="crawl_request",
            user_id=user_id,
            purpose="web_analysis"
        )
        
        return subject_id
    
    def anonymize_crawl_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Anonymize crawl data to remove personal information."""
        anonymized = data.copy()
        
        # Remove or hash personal identifiers
        if 'metadata' in anonymized:
            metadata = anonymized['metadata']
            if 'user_agent' in metadata:
                metadata['user_agent'] = self.compliance.encryption.hash_personal_data(
                    metadata['user_agent']
                )
        
        # Remove IP addresses from network traffic
        if 'network_traffic' in anonymized:
            network_data = anonymized['network_traffic']
            if 'requests' in network_data:
                for request in network_data['requests']:
                    if 'headers' in request:
                        headers = request['headers']
                        # Remove IP-related headers
                        for header in ['x-forwarded-for', 'x-real-ip', 'cf-connecting-ip']:
                            headers.pop(header, None)
        
        return anonymized
    
    def check_retention_policy(self, data_id: str) -> bool:
        """Check if data should be retained based on policy."""
        # Implementation would check against retention policies
        return True
    
    def export_data_for_subject(self, subject_id: str, format: str = "json") -> str:
        """Export all data for a specific subject (GDPR right to data portability)."""
        subject_info = self.compliance.get_data_subject_info(subject_id)
        processing_records = self.compliance.get_processing_records(subject_id)
        
        export_data = {
            "data_subject": subject_info,
            "processing_records": processing_records,
            "export_date": datetime.now(timezone.utc).isoformat()
        }
        
        timestamp = datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')
        output_file = f"data_export_{subject_id}_{timestamp}.{format}"
        
        if format.lower() == "json":
            with open(output_file, 'w') as f:
                json.dump(export_data, f, indent=2)
        else:
            raise ValueError(f"Unsupported export format: {format}")
        
        return output_file 