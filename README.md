# Markdown Header Indexer

Add or remove hierarchical numbering (like `1.1`, `1.2.3`) to your Markdown headings.

## Features

- **Update hierarchical numbering** to headings
- **Remove existing numbering** with one command
- **Configurable start level** (1-6) for numbering

## Commands

1. **Update Header Numbering** (`markdown-header-indexer.updateNumbering`):
   - Removes existing numbering
   - Adds hierarchical numbering (e.g., `## 1.2 Section Title`)
   - Respects your configured start level

2. **Remove Header Numbering** (`markdown-header-indexer.removeNumbering`):
   - Clears all numbering from headings
   - Returns headings to plain format (e.g., `## Section Title`)

## How to Use

1. Open any Markdown file
2. Run commands via Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`):
   - Type "Update Header Numbering" and press Enter
   - Type "Remove Header Numbering" and press Enter

For frequent use, **set custom keyboard shortcuts** (optional):
1. Go to File > Preferences > Keyboard Shortcuts
2. Add these to your `keybindings.json`:
```json
{
  "key": "ctrl+alt+n", 
  "command": "markdown-header-indexer.updateNumbering"
},
{
  "key": "ctrl+alt+m",
  "command": "markdown-header-indexer.removeNumbering"
}
```

## Configuration

Configure the starting level for numbering:
1. Open Settings (`Ctrl+,` or `Cmd+,`)
2. Search for "Markdown Header Indexer"
3. Set `Start Level` (1=add to all headings, 2=start from ## headings, etc.)