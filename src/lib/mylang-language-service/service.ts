import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const LANGUAGE_ID = 'mylang';
const THEME = 'mylang';

export const mylangLanguageService = {
  id: LANGUAGE_ID,
  theme: THEME,
  register: () => {
    monaco.languages.register({
      id: LANGUAGE_ID,
      extensions: [`.${LANGUAGE_ID}`],
      mimetypes: ['text/plain'],
    });

    // Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider(LANGUAGE_ID, {
      tokenizer: {
        root: [
          [/\[error.*/, 'custom-error'],
          [/\[notice.*/, 'custom-notice'],
          [/\[info.*/, 'custom-info'],
          [/\[[a-zA-Z 0-9:]+\]/, 'custom-date'],
        ],
      },
    });

    // Define a new theme that contains only rules that match this language
    monaco.editor.defineTheme(THEME, {
      base: 'vs',
      inherit: false,
      rules: [
        { token: 'custom-info', foreground: '#808080' },
        { token: 'custom-error', foreground: '#ff0000', fontStyle: 'bold' },
        { token: 'custom-notice', foreground: '#FFA500' },
        { token: 'custom-date', foreground: '#008800' },
      ],
      colors: {},
    });

    // Register a completion item provider for the new language
    monaco.languages.registerCompletionItemProvider(LANGUAGE_ID, {
      provideCompletionItems: (
        model,
        position,
        context,
        token,
      ): monaco.Thenable<monaco.languages.CompletionList> => {
        return new Promise<monaco.languages.CompletionList>(
          (resolve, reject) => {
            const wordUntil = model.getWordUntilPosition(position);
            const defaultRange = new monaco.Range(
              position.lineNumber,
              wordUntil.startColumn,
              position.lineNumber,
              wordUntil.endColumn,
            );
            var suggestions: monaco.languages.CompletionItem[] = [
              {
                label: 'simpleText',
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: 'simpleText',
                range: defaultRange,
              },
              {
                label: 'testing',
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: 'testing(${1:condition})', // eslint-disable-line
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: defaultRange,
              },
              {
                label: 'ifelse',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: [
                  'if (${1:condition}) {', // eslint-disable-line
                  '\t$0',
                  '} else {',
                  '\t',
                  '}',
                ].join('\n'),
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'If-Else Statement',
                range: defaultRange,
              },
            ];
            return resolve({ suggestions: suggestions });
          },
        );
      },
    });
  },
};
