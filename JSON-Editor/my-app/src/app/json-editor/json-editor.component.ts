import { Component } from '@angular/core';

@Component({
  selector: 'app-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.css']
})
export class JsonEditorComponent {
  fileContent: string = '';
  parsedJson: object | null = null;

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      try {
        const json = JSON.parse(fileReader.result as string);
        this.parsedJson = json;
        this.fileContent = 'Successfully loaded file.'
      } catch (e) {
        this.fileContent = 'Error loading file.';
      }
    };
    fileReader.readAsText(file as Blob);
  }

  onSave(): void {
  if (this.parsedJson) {
    const editedJsonStr = (document.querySelector('pre[contenteditable=true]') as HTMLElement).innerText;
    this.parsedJson = JSON.parse(editedJsonStr);
    const jsonStr = JSON.stringify(this.parsedJson);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    this.fileContent = 'Successfully saved file.';
  }
}


}
