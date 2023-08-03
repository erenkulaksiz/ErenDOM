let state = {
  click: 0,
  toggle: false,
  input: "",
  renders: 0,
};

const button = ({ newClick, text }) => ErenDOM.createNode({
  children: text,
  type: "button",
  onClick(e) {
    ErenDOM.setState({ click: newClick });
  }
});

const resetButton = () => {
  return ErenDOM.createNode({
    children: "reset",
    type: "button",
    onClick(e) {
      ErenDOM.setState({ click: 0 });
    }
  });
}

ErenDOM.onStateChange = function () {
  const content = ErenDOM.createNode({
    props: {
      style: {
        "display": "flex",
        "flex-direction": "column",
        "align-items": "center",
        "background-color": "#bdbdbd",
        "border-radius": "5px",
        "padding": "5px",
        "margin": "5px"
      },
      id: "selam",
      class: state.toggle ? "toggle--active" : "toggle--inactive",
    },
    children: [
      ErenDOM.createNode({
        props: {
          style: {
            "font-size": "24px"
          }
        },
        children: state.click,
      }),
      ErenDOM.createNode({
        props: {
          style: {
            "font-size": "24px"
          }
        },
        children: state.input,
      }),
      ErenDOM.createNode({
        props: {
          style: {
            "display": "flex",
            "gap": "2px",
            "margin-top": "4px",
          }
        },
        children: [
          button({ newClick: state.click - 1, text: "-" }),
          button({ newClick: state.click + 1, text: "+" }),
          resetButton(),
          ErenDOM.createNode({
            type: "button",
            children: "style test",
            onClick: () => ErenDOM.setState({ toggle: !state.toggle }),
            props: {
              id: "test",
              style: {
                "background-color": state.toggle ? "red" : "blue"
              }
            },
          }),
          ErenDOM.createNode({
            type: "button",
            children: "reset all state",
            onClick: () => {
              ErenDOM.setState({ toggle: false, click: 0, input: "" });
            },
            props: {
              id: "test",
              style: {
                "background-color": state.toggle ? "red" : "blue"
              }
            },
          }),
          ErenDOM.createNode({
            type: "input",
            onInput: ({ event, vnode }) => {
              ErenDOM.setState({ input: event.target.value });
              //ErenDOM.selectNode(vnode.identifier).focus();
            },
            value: state.input,
            props: {
              placeholder: "test",
              id: "testinput",
            },
          })
        ]
      })
    ]
  });

  ErenDOM.render(content, document.getElementById("root"));
}