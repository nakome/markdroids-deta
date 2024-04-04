/**
 * Simply Editor with insert,wrap,replace etc....
 */
export default class Editor {

  /**
   * Constructor
   */
  constructor(source) {
    this.history = [];
    this.undo = 0;
    this.redo = null;
    this.area = source;

    this.history[this.undo] = {
      value: this.area.value,
      selectionStart: 0,
      selectionEnd: 0,
    };

    this.undo++;
  }

  /**
   * Collect data from selected text inside a textarea
   *
   * <code>
   *   var editor = new Editor(elem);
   *   elem.onmouseup = function() {
   *       alert(editor.selection().start);
   *       alert(editor.selection().end);
   *       alert(editor.selection().value);
   *   };
   * </code>
   *
   */
  selection() {
    let start = this.area.selectionStart,
      end = this.area.selectionEnd,
      value = this.area.value.substring(start, end),
      before = this.area.value.substring(0, start),
      after = this.area.value.substring(end),
      data = {
        start: start,
        end: end,
        value: value,
        before: before,
        after: after,
      };
    return data;
  }

  /**
   * Select portion of text inside a textarea
   *
   * <code>
   *   var editor = new Editor(elem);
   *   editor.select(7, 11);
   * </code>
   *
   */
  select(start, end) {
    this.area.focus();
    this.area.setSelectionRange(start, end);
  }

  /**
   * Replace portion of selected text inside a textarea with something
   *
   * <code>
   *   var editor = new Editor(elem);
   *   editor.replace(/foo/, "bar");
   * </code>
   *
   */
  replace(from, to) {
    let sel = this.selection(),
      start = sel.start,
      end = sel.end,
      selections = sel.value.replace(from, to);

    this.area.value = sel.before + selections + sel.after;
    this.select(start, start + selections.length);
    this.updateHistory(this.area.value, {
      value: this.area.value,
      selectionStart: start,
      selectionEnd: start + selections.length,
    });
  }

  /**
   * Replace selected text inside a textarea with something
   *
   * <code>
   *   var editor = new Editor(elem);
   *   editor.insert('foo');
   * </code>
   *
   */
  insert(insertion) {
    let sel = this.selection();
    let val = sel.before + insertion + sel.after;
    this.area.value = val;
  }

  writeThis(insertion) {
    let sel = this.selection();
    let val = insertion + sel.after;
    Typing(this.area,val)
  }

  /**
   * Wrap selected text inside a textarea with something
   *
   * <code>
   *   var editor = new Editor(elem);
   *   editor.wrap('<strong>', '</strong>');
   * </code>
   *
   */
  wrap(open, close) {
    let sel = this.selection(),
      selections = sel.value,
      before = sel.before,
      after = sel.after;

    this.area.value = before + open + selections + close + after;
  }

  /**
   * Indent selected text inside a textarea with something
   *
   * <code>
   *   var editor = new Editor(elem);
   *   editor.indent('\t');
   * </code>
   *
   */
  indent(chars) {
    let sel = this.selection();
    if (sel.value.length > 0) {
      // Multi line
      this.replace(/(^|\n)([^\n])/gm, "$1" + chars + "$2");
    } else {
      // Single line
      this.area.value = sel.before + chars + sel.value + sel.after;
      this.select(sel.start + chars.length, sel.start + chars.length);
      this.updateHistory(this.area.value, {
        value: this.area.value,
        selectionStart: sel.start + chars.length,
        selectionEnd: sel.start + chars.length,
      });
    }
  }

  /**
   * Outdent selected text inside a textarea from something
   *
   * <code>
   *   var editor = new Editor(elem);
   *   editor.outdent('\t');
   * </code>
   *
   */
  outdent(chars) {
    let sel = this.selection();

    if (sel.value.length > 0) {
      let regex = `(^|\n)${chars}`;
      let multiline = new RegExp(regex, "gm");
      // Multi line
      this.replace(multiline, "$1");
    } else {
      // Single line
      let before = sel.before.replace(new RegExp(chars + "$"), "");
      this.area.value = before + sel.value + sel.after;
      this.select(before.length, before.length);
      this.updateHistory(this.area.value, {
        value: this.area.value,
        selectionStart: before.length,
        selectionEnd: before.length,
      });
    }
  }

  /**
   * Call available history data
   *
   * <code>
   *   var editor = new Editor(elem);
   *   alert(editor.callHistory(2).value);
   *   alert(editor.callHistory(2).selectionStart);
   *   alert(editor.callHistory(2).selectionEnd);
   * </code>
   *
   */
  callHistory(index) {
    return typeof index == "number" ? this.history[index] : this.history;
  }

  /**
   * Update history data
   *
   * <code>
   *   var editor = new Editor(elem);
   *   editor.area.onkeydown = function() {
   *       editor.updateHistory();
   *   };
   * </code>
   *
   */
  updateHistory(data, index) {
    let value =
      typeof data != "undefined"
        ? data
        : {
            value: this.area.value,
            selectionStart: this.selection().start,
            selectionEnd: this.selection().end,
          };

    this.history[typeof index == "number" ? index : this.undo] = value;
    this.undo++;
  }

  /**
   * Undo from previous action or previous Redo
   *
   * <code>
   *   var editor = new Editor(elem);
   *   editor.undo();
   * </code>
   *
   */
  undoHistory(callback) {
    let data;
    if (this.history.length > 1) {
      if (this.undo > 1) {
        this.undo--;
      } else {
        this.undo = 1;
      }
      data = this.callHistory(this.undo - 1);
      this.redo = this.undo <= 0 ? this.undo - 1 : this.undo;
    } else {
      return;
    }
    this.area.value = data.value;
    this.select(data.selectionStart, data.selectionEnd);
    console.log(this.undo)
    if (typeof callback == "function") callback;
  }

  /**
   * Redo from previous Undo
   *
   * <code>
   *   var editor = new Editor(elem);
   *   editor.redo();
   * </code>
   *
   */

  redoHistory(callback) {
    let data;
    if (this.redo !== null) {
      data = this.callHistory(this.redo);
      if (this.redo < this.history.length - 1) {
        this.redo++;
      } else {
        this.redo = this.history.length - 1;
      }
      this.undo = this.redo >= history.length - 1 ? this.redo + 1 : this.redo;
    } else {
      return;
    }
    this.area.value = data.value;
    this.select(data.selectionStart, data.selectionEnd);
    console.log(this.redo);
    if (typeof callback == "function") callback;
  }
}

