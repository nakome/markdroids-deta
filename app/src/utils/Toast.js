"use strict";


class Toasts {
  constructor(options) {

    let defaults = {
      position: "top-right",
      stack: [],
      offsetX: 20,
      offsetY: 20,
      gap: 20,
      numToasts: 0,
      duration: ".5s",
      timing: "ease",
      dimOld: true,
    };
    this.options = Object.assign(defaults, options);
  }

  push(obj) {
    this.options.numToasts++;
    let toast = document.createElement(obj.link ? "a" : "div");
    if (obj.link) {
      toast.href = obj.link;
      toast.target = obj.linkTarget ? obj.linkTarget : "_self";
    }
    toast.className =
      "toast-notification" +
      (obj.style ? " toast-notification-" + obj.style : "") +
      " toast-notification-" +
      this.options.position;
    toast.innerHTML = `
            <div class="toast-notification-wrapper">
                ${
                  obj.title
                    ? '<h3 class="toast-notification-header">' +
                      obj.title +
                      "</h3>"
                    : ""
                }
                ${
                  obj.content
                    ? '<div class="toast-notification-content">' +
                      obj.content +
                      "</div>"
                    : ""
                }
            </div>
            ${
              obj.closeButton == null || obj.closeButton === true
                ? '<button class="toast-notification-close">&times;</button>'
                : ""
            }
        `;
    document.body.appendChild(toast);
    toast.getBoundingClientRect();
    if (this.options.position == "top-left") {
      toast.style.top = 0;
      toast.style.left = this.options.offsetX + "px";
    } else if (this.options.position == "top-center") {
      toast.style.top = 0;
      toast.style.left = 0;
    } else if (this.options.position == "top-right") {
      toast.style.top = 0;
      toast.style.right = this.options.offsetX + "px";
    } else if (this.options.position == "bottom-left") {
      toast.style.bottom = 0;
      toast.style.left = this.options.offsetX + "px";
    } else if (this.options.position == "bottom-center") {
      toast.style.bottom = 0;
      toast.style.left = 0;
    } else if (this.options.position == "bottom-right") {
      toast.style.bottom = 0;
      toast.style.right = this.options.offsetX + "px";
    }
    if (obj.width || this.options.width) {
      toast.style.width = (obj.width || this.options.width) + "px";
    }
    toast.dataset.transitionState = "queue";
    let index = this.options.stack.push({
      element: toast,
      props: obj,
      offsetX: this.options.offsetX,
      offsetY: this.options.offsetY,
      index: 0,
    });
    this.options.stack[index - 1].index = index - 1;
    if (toast.querySelector(".toast-notification-close")) {
      toast.querySelector(".toast-notification-close").onclick = (event) => {
        event.preventDefault();
        this.closeToast(this.options.stack[index - 1]);
      };
    }
    if (obj.link) {
      toast.onclick = () => this.closeToast(this.options.stack[index - 1]);
    }
    this.openToast(this.options.stack[index - 1]);
    if (obj.onOpen) obj.onOpen(this.options.stack[index - 1]);
  }

  // Abre una notificación
  openToast(toast) {
    if (this.isOpening() === true) {
      return false;
    }
    toast.element.dataset.transitionState = "opening";
    toast.element.style.transition =
      this.options.duration + " transform " + this.options.timing;
    this._transformToast(toast);
    toast.element.addEventListener("transitionend", () => {
      if (toast.element.dataset.transitionState == "opening") {
        toast.element.dataset.transitionState = "complete";
        for (let i = 0; i < this.options.stack.length; i++) {
          if (
            this.options.stack[i].element.dataset.transitionState == "queue"
          ) {
            this.openToast(this.options.stack[i]);
          }
        }
        if (toast.props.dismissAfter) {
          this.closeToast(toast, toast.props.dismissAfter);
        }
      }
    });
    for (let i = 0; i < this.options.stack.length; i++) {
      if (this.options.stack[i].element.dataset.transitionState == "complete") {
        this.options.stack[i].element.dataset.transitionState = "opening";
        this.options.stack[i].element.style.transition =
          this.options.duration +
          " transform " +
          this.options.timing +
          (this.options.dimOld ? ", " + this.options.duration + " opacity ease" : "");
        if (this.options.dimOld) {
          this.options.stack[i].element.classList.add("toast-notification-dimmed");
        }
        this.options.stack[i].offsetY += toast.element.offsetHeight + this.options.gap;
        this._transformToast(this.options.stack[i]);
      }
    }
    return true;
  }

  closeToast(toast, delay = null) {
    if (this.isOpening() === true) {
      setTimeout(() => this.closeToast(toast, delay), 100);
      return false;
    }
    if (toast.element.dataset.transitionState == "close") {
      return true;
    }
    if (toast.element.querySelector(".toast-notification-close")) {
      toast.element.querySelector(".toast-notification-close").onclick = null;
    }
    toast.element.dataset.transitionState = "close";
    toast.element.style.transition =
      ".2s opacity ease" + (delay ? " " + delay : "");
    toast.element.style.opacity = 0;
    toast.element.addEventListener("transitionend", () => {
      if (toast.element.dataset.transitionState == "close") {
        let offsetHeight = toast.element.offsetHeight;
        if (toast.props.onClose) toast.props.onClose(toast);
        toast.element.remove();
        for (let i = 0; i < toast.index; i++) {
          this.options.stack[i].element.style.transition =
            this.options.duration + " transform " + this.options.timing;
          this.options.stack[i].offsetY -= offsetHeight + this.options.gap;
          this._transformToast(this.options.stack[i]);
        }
        let focusedToast = this.getFocusedToast();
        if (focusedToast) {
          focusedToast.element.classList.remove("toast-notification-dimmed");
        }
      }
    });
    return true;
  }

  isOpening() {
    let opening = false;
    for (let i = 0; i < this.options.stack.length; i++) {
      if (this.options.stack[i].element.dataset.transitionState == "opening") {
        opening = true;
      }
    }
    return opening;
  }

  getFocusedToast() {
    for (let i = 0; i < this.options.stack.length; i++) {
      if (this.options.stack[i].offsetY == this.options.offsetY) {
        return this.options.stack[i];
      }
    }
    return false;
  }

  _transformToast(toast) {
    if (this.options.position == "top-center") {
      toast.element.style.transform = `translate(calc(50vw - 50%), ${toast.offsetY}px)`;
    } else if (this.options.position == "top-right" || this.options.position == "top-left") {
      toast.element.style.transform = `translate(0, ${toast.offsetY}px)`;
    } else if (this.options.position == "bottom-center") {
      toast.element.style.transform = `translate(calc(50vw - 50%), -${toast.offsetY}px)`;
    } else if (
      this.options.position == "bottom-left" ||
      this.options.position == "bottom-right"
    ) {
      toast.element.style.transform = `translate(0, -${toast.offsetY}px)`;
    }
  }

  set stack(value) {
    this.options.stack = value;
  }
  get stack() {
    return this.options.stack;
  }
  set position(value) {
    this.options.position = value;
  }
  get position() {
    return this.options.position;
  }
  set offsetX(value) {
    this.options.offsetX = value;
  }
  get offsetX() {
    return this.options.offsetX;
  }
  set offsetY(value) {
    this.options.offsetY = value;
  }
  get offsetY() {
    return this.options.offsetY;
  }
  set gap(value) {
    this.options.gap = value;
  }
  get gap() {
    return this.options.gap;
  }
}


const Toast = new Toasts();
export default Toast;