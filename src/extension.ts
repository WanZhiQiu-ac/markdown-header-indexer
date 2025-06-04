import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // 注册更新编号命令（先移除再添加）
    let updateDisposable = vscode.commands.registerCommand('markdown-header-indexer.updateNumbering', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        // 获取配置
        const config = vscode.workspace.getConfiguration('markdownHeaderIndexer');
        const startLevel = config.get<number>('startLevel', 1);

        // 第一步：移除现有编号
        editor.edit(removeBuilder => {
            for (let lineNum = 0; lineNum < editor.document.lineCount; lineNum++) {
                const line = editor.document.lineAt(lineNum);
                // 匹配带编号的标题
                const match = line.text.match(/^(#+)\s*((\d+\.)+\s*)?(.*)/);
                
                if (match) {
                    // 移除编号，保留标题文本
                    const newText = `${match[1]} ${match[4].trim()}`;
                    const range = new vscode.Range(line.range.start, line.range.end);
                    removeBuilder.replace(range, newText);
                }
            }
        }).then(success => {
            if (!success || !editor) return;
            
            // 第二步：添加新编号（基于更新后的文档）
            editor.edit(addBuilder => {
                const counters: number[] = Array(6).fill(0);
                let lastLevel = 0;

                for (let lineNum = 0; lineNum < editor.document.lineCount; lineNum++) {
                    const line = editor.document.lineAt(lineNum);
                    const match = line.text.match(/^(#+)\s*(.*)/);
                    
                    if (match) {
                        const level = match[1].length;
                        const title = match[2].trim();
                        
                        // 重置计数器
                        if (level < lastLevel) {
                            for (let i = level; i < counters.length; i++) {
                                counters[i] = 0;
                            }
                        }
                        
                        lastLevel = level;
                        
                        if (level >= startLevel) {
                            counters[level - 1]++;
                            // 重置子级计数器
                            for (let i = level; i < counters.length; i++) {
                                counters[i] = 0;
                            }
                            
                            // 生成编号
                            let numberStr = '';
                            for (let i = startLevel - 1; i < level; i++) {
                                numberStr += `${counters[i]}.`;
                            }
                            
                            // 替换行
                            const newText = `${match[1]} ${numberStr} ${title}`;
                            const range = new vscode.Range(line.range.start, line.range.end);
                            addBuilder.replace(range, newText);
                        }
                    }
                }
            });
        });
    });

    // 注册移除编号命令
    let removeDisposable = vscode.commands.registerCommand('markdown-header-indexer.removeNumbering', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        editor.edit(editBuilder => {
            for (let lineNum = 0; lineNum < editor.document.lineCount; lineNum++) {
                const line = editor.document.lineAt(lineNum);
                const match = line.text.match(/^(#+)\s*((\d+\.)+\s*)?(.*)/);
                
                if (match) {
                    // 移除编号
                    const newText = `${match[1]} ${match[4].trim()}`;
                    const range = new vscode.Range(line.range.start, line.range.end);
                    editBuilder.replace(range, newText);
                }
            }
        });
    });

    context.subscriptions.push(updateDisposable, removeDisposable);
}

export function deactivate() {}