# DataBricks Notebook - Quick Usage Guide

## 🚀 Quick Start

### 1. Import the Component

```tsx
import { DataBricksNotebook, DataBricksDemo, IntegrationExample } from './components';
```

### 2. Basic Usage

```tsx
function MyApp() {
  const handleSave = (notebook: any) => {
    console.log('Saving notebook:', notebook);
    // Save to your backend
  };

  return (
    <DataBricksNotebook
      notebookId="my-notebook"
      onSave={handleSave}
      readOnly={false}
    />
  );
}
```

### 3. With Collaboration

```tsx
const collaborators = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: '/avatars/sarah.jpg',
    isActive: true,
    cursor: { x: 150, y: 200 }
  }
];

<DataBricksNotebook
  notebookId="collaborative-notebook"
  collaborators={collaborators}
  onSave={handleSave}
  readOnly={false}
/>
```

## 📊 Demo Components

### DataBricksDemo
Shows a landing page with features and launches the notebook:

```tsx
<DataBricksDemo />
```

### IntegrationExample
Shows how to integrate with your crawler:

```tsx
<IntegrationExample />
```

## 🔧 Integration with Your Crawler

### Connect to Crawler API

```tsx
const crawlerAPI = {
  // Get crawl results
  getResults: async (crawlId: string) => {
    const response = await fetch(`/api/crawler/${crawlId}/results`);
    return response.json();
  },
  
  // Start new crawl
  startCrawl: async (url: string, options: any) => {
    const response = await fetch('/api/crawler/start', {
      method: 'POST',
      body: JSON.stringify({ url, options })
    });
    return response.json();
  }
};
```

### Load Crawler Data in Notebook

```tsx
// In a code cell
import pandas as pd
import requests

# Load data from your crawler API
response = requests.get('/api/crawler/latest/results')
data = response.json()

# Convert to DataFrame
df = pd.DataFrame(data)

# Analyze the data
print(f"Total pages crawled: {len(df)}")
print(f"Average load time: {df['load_time'].mean():.2f}s")
```

## 🎨 Customization

### Custom Theme

```tsx
// Override CSS variables
:root {
  --notebook-bg: #1a1d21;
  --notebook-text: #ffffff;
  --cell-border: #3b82f6;
}
```

### Custom Cell Types

```tsx
// Extend the cell interface
interface CustomCell extends NotebookCell {
  type: 'custom';
  customProps: any;
}
```

## 📱 Responsive Design

The notebook is fully responsive and works on:
- Desktop (full features)
- Tablet (sidebar collapsible)
- Mobile (minimal interface)

## 🔌 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `notebookId` | `string` | - | Unique notebook identifier |
| `collaborators` | `User[]` | `[]` | Array of collaborative users |
| `onSave` | `(notebook: any) => void` | - | Save callback |
| `onLoad` | `(id: string) => Promise<any>` | - | Load callback |
| `readOnly` | `boolean` | `false` | Read-only mode |

### Events

```tsx
// Cell execution
onCellExecute: (cellId: string, code: string) => void

// Cell content change
onCellChange: (cellId: string, content: string) => void

// Cell deletion
onCellDelete: (cellId: string) => void
```

## 🧪 Testing

### Unit Tests

```bash
npm test -- --testPathPattern=DataBricksNotebook
```

### Integration Tests

```bash
npm run test:integration -- --testPathPattern=notebook
```

## 🐛 Troubleshooting

### Common Issues

1. **Component not rendering**
   - Check if all dependencies are installed
   - Verify shadcn/ui components are set up

2. **Styling issues**
   - Ensure Tailwind CSS is configured
   - Check for CSS conflicts

3. **Collaboration not working**
   - Verify WebSocket connection
   - Check user authentication

### Debug Mode

```tsx
<DataBricksNotebook
  debug={true}
  onError={(error) => console.error('Notebook error:', error)}
/>
```

## 📚 Examples

### Basic Analysis Notebook

```tsx
const analysisNotebook = {
  cells: [
    {
      id: 'cell-1',
      type: 'markdown',
      content: '# Data Analysis\n\nThis notebook analyzes crawled data.'
    },
    {
      id: 'cell-2',
      type: 'code',
      content: `import pandas as pd
import matplotlib.pyplot as plt

# Load data
df = pd.read_json('crawler_results.json')
print(f"Dataset: {df.shape}")`
    },
    {
      id: 'cell-3',
      type: 'visualization',
      content: `# Create visualization
plt.figure(figsize=(10, 6))
df['load_time'].hist(bins=20)
plt.title('Page Load Time Distribution')
plt.show()`
    }
  ]
};
```

### SQL Analysis

```tsx
const sqlCell = {
  id: 'sql-1',
  type: 'sql',
  content: `SELECT 
    domain,
    COUNT(*) as page_count,
    AVG(load_time) as avg_load_time
FROM crawled_pages 
WHERE crawled_at >= '2024-01-01'
GROUP BY domain
ORDER BY page_count DESC`
};
```

## 🚀 Production Deployment

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_URL=wss://ws.yourdomain.com
NEXT_PUBLIC_AUTH_DOMAIN=yourdomain.auth0.com
```

### Performance Optimization

```tsx
// Use React.memo for performance
const OptimizedNotebook = React.memo(DataBricksNotebook);

// Lazy load for large notebooks
const LazyNotebook = React.lazy(() => import('./DataBricksNotebook'));
```

## 📞 Support

- **Documentation**: See `README.md` for full documentation
- **Issues**: Report bugs on GitHub
- **Discussions**: Ask questions in GitHub Discussions
- **Enterprise**: Contact for enterprise support

## 🔄 Updates

Check for updates regularly:

```bash
npm update @your-org/databricks-notebook
```

## 📄 License

MIT License - see LICENSE file for details. 