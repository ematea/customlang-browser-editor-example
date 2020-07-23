import { useState } from 'react';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import { mylangLanguageService } from './service';

export const useMonacoEditor = (
  args: { initialValue: string } = { initialValue: '' },
) => {
  const [value, setValue] = useState(args.initialValue);

  const options: monaco.editor.IStandaloneEditorConstructionOptions = {
    selectOnLineNumbers: true,
    glyphMargin: true,
    lightbulb: {
      enabled: true,
    },
  };

  const handleEditorDidMount = (
    e: monaco.editor.IStandaloneCodeEditor,
    m: typeof monaco,
  ) => {
    const uri: monaco.Uri = m.Uri.parse(
      `inmemory://model.${mylangLanguageService.id}`,
    );
    e.setModel(m.editor.createModel(value, mylangLanguageService.id, uri));
    e.focus();
  };

  return {
    language: mylangLanguageService.id,
    options,
    value,
    onChange: setValue,
    editorDidMount: handleEditorDidMount,
    theme: mylangLanguageService.theme,
  };
};
