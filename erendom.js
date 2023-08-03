function guid() {
  function _p8(s) {
    var p = (Math.random().toString(16) + "000000000").substr(2, 8);
    return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
  }
  return _p8() + _p8(true) + _p8(true) + _p8();
}

var ErenDOM = {
  render(content, root) {
    const { vnode = null } = content;
    if (vnode) {
      const element = this.vnodeToElement(vnode);

      console.log(vnode);

      while (root.hasChildNodes()) root.removeChild(root.firstChild);
      root.appendChild(element);
    }
  },
  appendChild(parent, child) {
    parent.appendChild(child);
  },
  vnodeToElement(vnode) {
    if (!vnode?.type) {
      return document.createTextNode(vnode);
    }
    const element = document.createElement(vnode.type);

    if (vnode.props) {
      Object.keys(vnode.props).forEach(prop => {
        if (prop == "style") {
          Object.keys(vnode.props[prop]).forEach(style => {
            element.style[style] = vnode.props[prop][style];
          });
        } else {
          element.setAttribute(prop, vnode.props[prop])
        }
      });
    }

    if (vnode.onClick) {
      element.addEventListener("click", event => {
        vnode.onClick({ event, vnode });
      });
    }

    if (vnode.onInput) {
      element.addEventListener("input", event => {
        vnode.onInput({ event, vnode });
      });
    }

    if (vnode.value) {
      element.value = vnode.value;
    }

    if (vnode.children) {
      if (Array.isArray(vnode.children)) {
        vnode.children.forEach(child => {
          ErenDOM.appendChild(element, ErenDOM.vnodeToElement(child));
        });
      } else {
        ErenDOM.appendChild(element, ErenDOM.vnodeToElement(vnode.children));
      }
    }

    return element;
  },
  createNode({
    props,
    children,
    type = "div",
    value,
    identifier,
    onClick,
    onInput,
    onNodeMount,
  }) {
    let vnode = { type };
    if (props) vnode = { ...vnode, props };
    if (value) {
      vnode = { ...vnode, value };
    }

    let vnodeIdentifier = {};

    if (!identifier) {
      vnodeIdentifier = { toString: type, _vnode: guid() };
      if (props?.id || props?.class) {
        if (props?.id) {
          vnodeIdentifier.toString += `#${props.id}`;
          vnodeIdentifier = {
            ...vnodeIdentifier,
            id: props.id
          }
        };
        if (props?.class) {
          vnodeIdentifier.toString += `.${props.class}`;
          vnodeIdentifier = {
            ...vnodeIdentifier,
            class: props.class,
          }
        }
      }
    } else {
      vnodeIdentifier = identifier;
    }
    vnode = {
      ...vnode,
      identifier: vnodeIdentifier,
    }

    if (typeof children != "undefined") {
      if (Array.isArray(children)) {
        const childs = [];
        children.forEach(el => {
          childs.push(el.vnode);
        });
        vnode = {
          ...vnode,
          children: [...childs]
        }
      } else {
        vnode = {
          ...vnode,
          children,
        };
      }
    }

    if (typeof onClick == "function") {
      vnode = {
        ...vnode,
        onClick
      }
    }

    if (typeof onInput == "function") {
      vnode = {
        ...vnode,
        onInput
      }
    }

    if (props) {
      if (props.style) {
        let allStyles = "";
        Object.keys(props.style).forEach(style => {
          allStyles += `${style}:${props.style[style]};`;
        });
      }
    }

    if (typeof onNodeMount == "function") {
      onNodeMount(vnode);
    }

    return { vnode };
  },
  setState(newState) {
    state = {
      ...state,
      ...newState
    }
    this.callStateChange();
  },
  onMount() {
    window.removeEventListener('DOMContentLoaded', e => this.callStateChange(e));
    window.addEventListener('DOMContentLoaded', e => this.callStateChange(e));
  },
  callStateChange(e) {
    if (typeof ErenDOM.onStateChange == "function") ErenDOM.onStateChange(e);
  },
  selectNode(node) {
    if (node?.id) return document.getElementById(node.id);
    if (node?.class) return document.getElementsByClassName(node.class);
    // otherwise we need to search for node identifier
    // identifier: node._vnode
  },
}

ErenDOM.onMount();