import { Component, createMemo, For, JSXElement } from "solid-js";
import { render } from "solid-js/web";
import "uno.css";
import { createParser } from "../src";

const { tokenize, childrenTokens } = createParser("calculator");

type Meta = { callback: (props: Props) => JSXElement };
type Props = {
  value: number;
  children?: JSXElement | JSXElement[];
};

type CustomToken = TokenValue | TokenAdd | TokenSubtract;

const Calculator = (props: {
  children: JSXElement | JSXElement[] | CustomToken | CustomToken[];
}) => {
  const tokens = childrenTokens(() => props.children);

  const calculation = () => {
    let result = 0;
    tokens().forEach(token => {
      console.log("token is ", token);
      if (token.id === "Value") {
        result = token.props.value;
      } else if (token.id === "Add") {
        result += token.props.value;
      } else if (token.id === "Subtract") {
        result -= token.props.value;
      }
      console.log("result is", result);
    });
    return result;
  };

  return (
    <div>
      <For each={tokens()}>{token => token.callback(token.props)}</For> = {calculation()}
    </div>
  );
};

type MetaValue = {
  id: "Value";
} & Meta;
type TokenValue = MetaValue & { props: Props };

const Value = tokenize<Props, TokenValue>(props => ({
  props,
  id: "Value",
  callback: props => <>{props.value}</>
}));

type MetaAdd = {
  id: "Add";
} & Meta;
type TokenAdd = MetaAdd & { props: Props };

const Add = tokenize<Props, TokenAdd>(props => ({
  props,
  id: "Add",
  callback: (props: Props) => <> + {props.value}</>
}));

type MetaSubtract = {
  id: "Subtract";
} & Meta;
type TokenSubtract = MetaSubtract & { props: Props };

const Subtract = tokenize<Props, TokenSubtract>(props => ({
  props,
  id: "Subtract",
  callback: (props: Props) => <> - {props.value}</>
}));

const App: Component = () => {
  return (
    <Calculator>
      <Value value={1} />
      <Add value={4} />
      <Subtract value={2} />
    </Calculator>
  );
};

render(() => <App />, document.getElementById("root")!);
