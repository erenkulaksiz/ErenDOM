var ErenDOM = {
  _vnode: 1,
  renderedVnodeTree: null,
  renderedTree: null,
  state: {},
  getState: () => ErenDOM.state,
  setState(newState) {
    ErenDOM.state = {
      ...ErenDOM.state,
      ...newState
    }
    ErenDOM.callStateChange();
  },
  render(content, root) {
    const { vnode = null } = content;

    if (!vnode) return console.error("vnode is null");
    if (!root) return console.error("root is null");

    if (ErenDOM.renderedVnodeTree) {
      console.log("beforeRender", ErenDOM.renderedVnodeTree, "afterRender", vnode);
    }

    const element = ErenDOM.vnodeToElement(vnode);

    while (root.hasChildNodes()) root.removeChild(root.firstChild);
    ErenDOM.appendChild(root, element);

    ErenDOM.renderedTree = element;
    ErenDOM.renderedVnodeTree = vnode;
    ErenDOM._vnode = 1;
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

    if (vnode.identifier.guid) {
      element.setAttribute("data-erendom-identifier", vnode.identifier.guid);
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
      vnodeIdentifier = { toString: type, guid: ErenDOM._vnode++ };
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

    if (typeof onNodeMount == "function") {
      onNodeMount(vnode);
    }

    return { vnode };
  },
  onMount() {
    window.removeEventListener('DOMContentLoaded', e => ErenDOM.callStateChange(e));
    window.addEventListener('DOMContentLoaded', e => ErenDOM.callStateChange(e));
  },
  callStateChange(e) {
    if (typeof ErenDOM.onStateChange == "function") ErenDOM.onStateChange(e);
  },
  selectNode(vnode) {
    return ErenDOM.renderedTree.querySelector(`[data-erendom-identifier="${vnode.identifier.guid}"]`);
  },
}

ErenDOM.onMount();