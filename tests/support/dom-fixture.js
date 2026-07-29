"use strict";

function dataPropertyName(attributeName) {
  return attributeName
    .slice(5)
    .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

class FakeEventTarget {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  dispatchEvent(event) {
    event.target ||= this;
    event.currentTarget = this;
    for (const listener of this.listeners.get(event.type) || []) {
      listener.call(this, event);
    }
    return true;
  }
}

function selectorParts(selector) {
  const notDisabled = selector.endsWith(":not(:disabled)");
  const base = notDisabled
    ? selector.slice(0, -":not(:disabled)".length)
    : selector;
  const tagMatch = base.match(/^[a-z]+/i);
  const idMatch = base.match(/^#([\w-]+)$/);
  const attributes = Array.from(base.matchAll(
    /\[([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'))?\]/g,
  )).map((match) => ({
    name: match[1],
    value: match[2] ?? match[3],
  }));
  return {
    tagName: tagMatch?.[0].toUpperCase(),
    id: idMatch?.[1],
    attributes,
    notDisabled,
  };
}

class FakeElement extends FakeEventTarget {
  constructor(tagName, ownerDocument) {
    super();
    this.tagName = tagName.toUpperCase();
    this.ownerDocument = ownerDocument;
    this.parentElement = null;
    this.children = [];
    this.attributes = new Map();
    this.dataset = new Proxy({}, {
      set: (target, property, value) => {
        const stringValue = String(value);
        target[property] = stringValue;
        const attributeName = `data-${String(property).replace(
          /[A-Z]/g,
          (letter) => `-${letter.toLowerCase()}`,
        )}`;
        this.attributes.set(attributeName, stringValue);
        return true;
      },
    });
    this.style = {
      setProperty: (name, value) => {
        this.style[name] = String(value);
      },
    };
    this.hidden = false;
    this.disabled = false;
    this.className = "";
    this._textContent = "";
    if (this.tagName === "OUTPUT" || this.tagName === "INPUT") {
      this.value = "";
    }
  }

  get textContent() {
    return this._textContent;
  }

  set textContent(value) {
    this._textContent = String(value);
    this.replaceChildren();
  }

  setAttribute(name, value) {
    const stringValue = String(value);
    this.attributes.set(name, stringValue);
    if (name === "id") this.id = stringValue;
    if (name === "class") this.className = stringValue;
    if (name === "disabled") this.disabled = true;
    if (name === "hidden") this.hidden = true;
    if (name.startsWith("data-")) {
      this.dataset[dataPropertyName(name)] = stringValue;
    }
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  append(...children) {
    for (const child of children) {
      child.parentElement = this;
      this.children.push(child);
    }
  }

  replaceChildren(...children) {
    for (const child of this.children) child.parentElement = null;
    this.children = [];
    this.append(...children);
  }

  matches(selector) {
    const parts = selectorParts(selector);
    if (parts.id) return this.id === parts.id;
    if (parts.tagName && this.tagName !== parts.tagName) return false;
    if (parts.notDisabled && this.disabled) return false;
    if (!parts.attributes.length) return Boolean(parts.tagName);
    return parts.attributes.every(({ name, value }) => (
      this.attributes.has(name)
      && (value === undefined || this.getAttribute(name) === value)
    ));
  }

  querySelectorAll(selector) {
    const matches = [];
    const visit = (element) => {
      for (const child of element.children) {
        if (child.matches(selector)) matches.push(child);
        visit(child);
      }
    };
    visit(this);
    return matches;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  focus() {
    this.ownerDocument.activeElement = this;
    this.dispatchEvent({ type: "focus" });
  }

  click() {
    if (!this.disabled) this.dispatchEvent({ type: "click" });
  }
}

class FakeDocument extends FakeEventTarget {
  constructor() {
    super();
    this.documentElement = { lang: "en" };
    this.activeElement = null;
    this.body = new FakeElement("body", this);
  }

  createElement(tagName) {
    return new FakeElement(tagName, this);
  }

  getElementById(id) {
    return this.body.querySelector(`#${id}`);
  }

  querySelectorAll(selector) {
    return this.body.querySelectorAll(selector);
  }

  querySelector(selector) {
    return this.body.querySelector(selector);
  }
}

function appendElement(document, parent, tagName, attributes = {}, text = "") {
  const element = document.createElement(tagName);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  if (text) element.textContent = text;
  parent.append(element);
  return element;
}

function createLabsDocument() {
  const document = new FakeDocument();

  const radar = appendElement(document, document.body, "article", {
    id: "opportunity-radar",
  });
  const filters = appendElement(document, radar, "div");
  for (const [context, text] of [
    ["all", "All"],
    ["industrial", "Industrial"],
    ["telecom", "Telecom"],
    ["embedded", "Embedded"],
  ]) {
    appendElement(document, filters, "button", {
      "data-radar-context": context,
      "data-lab-text": `radar.filter.${context}`,
      "aria-pressed": String(context === "all"),
    }, text);
  }
  const plot = appendElement(document, radar, "div", {
    "data-radar-plot": "",
    "data-lab-aria": "radar.plotLabel",
  });
  appendElement(document, plot, "table", { "data-radar-fallback": "" });
  appendElement(document, radar, "ul", {
    "data-radar-list": "",
    "data-lab-aria": "radar.selectLabel",
    hidden: "",
  });
  appendElement(document, radar, "output", {
    "data-radar-result": "",
  });
  appendElement(document, radar, "button", {
    "data-lab-reset": "radar",
  }, "Reset");

  const roadmap = appendElement(document, document.body, "article", {
    id: "roadmap-builder",
  });
  for (const stage of ["now", "next", "later"]) {
    appendElement(document, roadmap, "h4", {
      "data-lab-text": `roadmap.${stage}`,
    }, stage);
    appendElement(document, roadmap, "ul", {
      "data-roadmap-stage": stage,
    });
  }
  appendElement(document, roadmap, "output", {
    "data-roadmap-summary": "",
  });
  appendElement(document, roadmap, "button", {
    "data-roadmap-copy": "",
    "data-lab-text": "roadmap.copy",
  }, "Copy summary");
  appendElement(document, roadmap, "span", {
    "data-roadmap-copy-status": "",
  });
  appendElement(document, roadmap, "button", {
    "data-lab-reset": "roadmap",
  }, "Reset");

  return document;
}

module.exports = {
  createLabsDocument,
};
