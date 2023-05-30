import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';

export default function CodeEditor({ defaultCode, language, setCode }) {

    const handleEditorChange = (value, event) => {
        setCode(value);
    }


    const monaco = useMonaco();
    const editorRef = useRef(null);

    useEffect(() => {
        if (monaco) {
            monaco.editor.defineTheme('myCustomTheme', {
                base: 'vs',
                inherit: true,
                rules: [],
                colors: {
                    // line highlight color
                    'editor.lineHighlightBackground': '#eef9ff',
                    // Custom scroll bar colors
                    'scrollbarSlider.background': '#eefaff',
                    'scrollbarSlider.hoverBackground': '#d9eeff',
                    'scrollbarSlider.activeBackground': '#9ed3ff',
                }
            });

            monaco.editor.setTheme('myCustomTheme');
            console.log(language)
        }
    }, [monaco]);

    if (language == 'js') {
        language = "javascript"
    }

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.setValue(defaultCode); // Update the value of the editor
            editorRef.current.getModel().updateOptions({ language }); // Update the language of the model
        }
        console.log(defaultCode)
        console.log(language)
    }, [defaultCode, language]);

    return (
        <Editor
            height="100%"
            language={language}
            value={defaultCode}
            onChange={handleEditorChange}
            editorDidMount={(editor) => {
                editorRef.current = editor;
            }}
        />
    )
}

/* 
Chat gpt helped me fix this editor styles, which used to change to defult style on each re-render

```javascript
import Editor, { useMonaco } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';

export default function CodeEditor({ defaultCode, language, setCode }) {
  const handleEditorChange = (value, event) => {
    setCode(value);
  }

  const monaco = useMonaco();
  const editorRef = useRef(null);
```

In this section, we import the necessary dependencies, including the `Editor` component from `@monaco-editor/react`, and the required hooks from `react`. We define the `CodeEditor` component that receives `defaultCode`, `language`, and `setCode` as props. The `defaultCode` represents the initial code in the editor, `language` represents the programming language used in the editor, and `setCode` is a callback function to update the code.

Next, we declare the `handleEditorChange` function that will be called whenever the content of the editor changes. It updates the code using the `setCode` callback.

We use the `useMonaco` hook from `@monaco-editor/react` to access the `monaco` instance.

The `editorRef` is a reference to the editor instance that will be stored using the `useRef` hook.

```javascript
  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('myCustomTheme', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
          'editor.lineHighlightBackground': '#eef9ff',
          'scrollbarSlider.background': '#eefaff',
          'scrollbarSlider.hoverBackground': '#d9eeff',
          'scrollbarSlider.activeBackground': '#9ed3ff',
        }
      });

      monaco.editor.setTheme('myCustomTheme');
    }
  }, [monaco]);
```

In this `useEffect` hook, we check if the `monaco` instance is available. If it is, we define a custom theme called `'myCustomTheme'` using `monaco.editor.defineTheme()`. We specify the desired styling properties for the theme, such as background colors for line highlights and scrollbar sliders. Then, we set the theme using `monaco.editor.setTheme()`.

By applying the theme, we ensure that the desired styling is applied to the editor.

```javascript
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(defaultCode); // Update the value of the editor
      editorRef.current.getModel().updateOptions({ language }); // Update the language of the model
    }
  }, [defaultCode, language]);
```

In this `useEffect` hook, we check if the `editorRef.current` exists, indicating that the editor instance has been mounted. If it exists, we can access the editor instance using `editorRef.current`.

We update the value of the editor by calling `editorRef.current.setValue(defaultCode)` with the `defaultCode` prop.

We also update the language of the editor's model by calling `editorRef.current.getModel().updateOptions({ language })` with the `language` prop.

By updating the value and language of the editor instance whenever these props change, we ensure that the editor reflects the new code and language.

```javascript
  return (
    <Editor
      height="100%"
      language={language}
      value={defaultCode}
      onChange={handleEditorChange}
      editorDidMount={(editor) => {
        editorRef.current = editor; // Store the editor instance in a ref
      }}
    />
  )
}
```

Finally, we return the `Editor` component from `
*/