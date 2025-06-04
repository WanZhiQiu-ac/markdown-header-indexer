"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    // 注册添加编号命令
    let addDisposable = vscode.commands.registerCommand('markdown-numbering.addNumbering', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const config = vscode.workspace.getConfiguration('markdownNumbering');
        const startLevel = config.get('startLevel', 1);
        editor.edit(editBuilder => {
            const counters = Array(6).fill(0);
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
                        editBuilder.replace(range, newText);
                    }
                }
            }
        });
    });
    // 注册移除编号命令
    let removeDisposable = vscode.commands.registerCommand('markdown-numbering.removeNumbering', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        editor.edit(editBuilder => {
            for (let lineNum = 0; lineNum < editor.document.lineCount; lineNum++) {
                const line = editor.document.lineAt(lineNum);
                const match = line.text.match(/^(#+)\s*(\d+\.)+\s*(.*)/);
                if (match) {
                    // 移除编号
                    const newText = `${match[1]} ${match[3]}`;
                    const range = new vscode.Range(line.range.start, line.range.end);
                    editBuilder.replace(range, newText);
                }
            }
        });
    });
    context.subscriptions.push(addDisposable, removeDisposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map