ErenDOM.setState({
  click: 0,
  toggle: false,
  input: "",
  renders: 0,
})

const button = ({ newClick, text }) => ErenDOM.createNode({
  children: text,
  type: "button",
  onClick(e) {
    ErenDOM.setState({ click: newClick });
  }
});

const resetButton = () => ErenDOM.createNode({
  children: "reset",
  type: "button",
  onClick(e) {
    ErenDOM.setState({ click: 0 });
  }
});

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
      class: ErenDOM.getState().toggle ? "toggle--active" : "toggle--inactive",
    },
    children: [
      ErenDOM.createNode({
        props: {
          style: {
            "font-size": "24px"
          }
        },
        children: ErenDOM.getState().click,
      }),
      ErenDOM.createNode({
        props: {
          style: {
            "font-size": "24px"
          }
        },
        children: ErenDOM.getState().input,
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
          button({ newClick: ErenDOM.getState().click - 1, text: "-" }),
          button({ newClick: ErenDOM.getState().click + 1, text: "+" }),
          resetButton(),
          ErenDOM.createNode({
            type: "button",
            children: "style test",
            onClick: () => ErenDOM.setState({ toggle: !ErenDOM.getState().toggle }),
            props: {
              id: "test",
              style: {
                "background-color": ErenDOM.getState().toggle ? "red" : "blue"
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
                "background-color": ErenDOM.getState().toggle ? "red" : "blue"
              }
            },
          }),
          ErenDOM.createNode({
            type: "input",
            onInput: ({ event, vnode }) => {
              ErenDOM.setState({ input: event.target.value });
              ErenDOM.selectNode(vnode).focus();
            },
            value: ErenDOM.getState().input,
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