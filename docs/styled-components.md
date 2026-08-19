Styled Components 备忘清单
====

[![NPM version](https://img.shields.io/npm/v/styled-components.svg?style=flat)](https://npmjs.org/package/styled-components)
[![Downloads](https://img.shields.io/npm/dm/styled-components.svg?style=flat)](https://www.npmjs.com/package/styled-components)
[![Repo Dependents](https://badgen.net/github/dependents-repo/styled-components/styled-components)](https://github.com/styled-components/styled-components/network/dependents)
[![Github repo](https://badgen.net/badge/icon/Github?icon=github&label)](https://github.com/styled-components/styled-components)

此快速参考备忘单提供了使用 CSS in JS 工具的各种方法

入门
----

### 安装

[Styled Components](https://styled-components.com) 是增强 CSS 在 React 组件系统样式的 CSS in JS 的最佳实践。

- [VSCode styled-components](https://github.com/styled-components/vscode-styled-components) _有代码高亮和代码提示_
- [VIM styled-components](https://github.com/styled-components/vim-styled-components) _有代码高亮_
- [WebStorm styled-components](https://github.com/styled-components/webstorm-styled-components) _有代码高亮和代码提示_

安装依赖和 TypeScript 类型依赖

```bash
npm install --save styled-components
```

### 快速开始

```jsx
import styled from 'styled-components';
```

创建一个 Title 组件

```jsx
// 该组件将呈现具有样式的 <h1> 标签
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
`;
```

创建一个 Wrapper 组件

```jsx
// 该组件将呈现具有某些样式的 <section> 标记
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;
```

像使用其他 React 组件一样使用 Title/Wrapper - 除了它们的样式！

```jsx
function Demo() {
  return (
    <Wrapper>
      <Title>
        Hello World!
      </Title>
    </Wrapper>
  );
}
```

### 根据 Props 适配

```jsx
import styled from 'styled-components';

const Button = styled.button`
  /* 根据主要 props 调整颜色 */
  background: ${
    props => 
      props.primary ? "blue" : "white"
  };
  color: ${
    props => 
      props.primary ? "white" : "blue"
  };
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid blue;
  border-radius: 3px;
`;
```

使用 `primary` props 控制按钮样式

```jsx {5}
function Demo() {
  return (
    <div>
      <Button>Normal</Button>
      <Button primary>Primary</Button>
    </div>
  );
}
```

### 扩展样式

```jsx {7}
const Button = styled.button`
  color: palevioletred;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;
// 基于 Button 的新组件，但具有一些覆盖样式
const TomatoButton = styled(Button)`
  color: tomato;
  border-color: tomato;
`;
const Demo = () => (
  <div>
    <Button>普通按钮</Button>
    <TomatoButton>番茄色按钮</TomatoButton>
  </div>
);
```

### 扩展样式改变标签 (as)

```jsx {17,20}
const Button = styled.button`
  color: palevioletred;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
  display: block;
`;

const TomatoButton = styled(Button)`
  color: tomato;
  border-color: tomato;
`;

const Demo = () => (
  <div>
    <Button>普通按钮</Button>
    <Button as="a" href="#">
      按钮样式的链接
    </Button>
    <TomatoButton as="a" href="#">
      番茄按钮样式的链接
    </TomatoButton>
  </div>
);
```

### 自定义组件(as)

```jsx {20}
const Button = styled.button`
  color: palevioletred;
  font-size: 1em;
  border: 2px solid palevioletred;
  display: block;
`;

const ReversedButton = props => (
  <Button
    {...props}
    children={
      props.children.split('').reverse()
    }
  />
);

render(
  <div>
    <Button>普通按钮</Button>
    <Button as={ReversedButton}>
      具有普通按钮样式的自定义按钮
    </Button>
  </div>
);
```

### 样式化任何组件

```jsx
const Link = ({ className, children }) => (
  <a className={className}>
    {children}
  </a>
);
const StyledLink = styled(Link)`
  color: palevioletred;
  font-weight: bold;
`;
<StyledLink className="hello" />
```

### 在 render 之外定义 Styled 组件

```jsx {3}
const Box = styled.div`/* ... */`;
const Wrapper = ({ message }) => {
  // ⚠️ 不能在这里定义 styled 组件
  return (
    <Box>
      {message}
    </Box>
  );
};
```

注意：组件 `Box` 不能放到 `Wrapper` 函数组件里面

### 传入值

```jsx {3,4,17}
const Input = styled.input`
  color: ${
    props => 
      props.inputColor || "palevioletred"
  };
  background: papayawhip;
`;
const Demo = () => (
  <div>
    <Input
      defaultValue="@probablyup"
      type="text"
    />
    <Input
      defaultValue="@geelen"
      type="text"
      inputColor="rebeccapurple"
    />
  </div>
);
```

### 样式对象

```jsx {2,5}
const PropsBox = styled.div(props => ({
  background: props.background,
  height: '50px',
  width: '50px',
  fontSize: '12px'
}));
```

在组件中使用

```jsx {5}
const Example = () => {
  return (
    <div>
      <PropsBox
        background="blue"
      />
    </div>
  );
}
```

注意：样式对象里面的样式并不是 CSS 中的写法。

### CSSModules => styled

```jsx
import React, { useState } from 'react';
import styles from './styles.css';

function ExampleCounter() {
  const [count, setCount] = useState(0)
  return (
    <div className={styles.counter}>
      <p className={styles.paragraph}>
        {count}
      </p>
      <button
        className={styles.button}
        onClick={() => setCount(count +1)}
      >
        +
      </button>
      <button
        className={styles.button}
        onClick={() => setCount(count -1)}
      >
        -
      </button>
    </div>
  );
}
```

#### 👇👇 与下面 **styled** 写法等效 👇👇

```jsx
import styled from 'styled-components';

const StyledCounter = styled.div`
  /* ... */
`;
const Paragraph = styled.p`
  /* ... */
`;
const Button = styled.button`
  /* ... */
`;
function ExampleCounter() {
  const [count, setCount] = useState(0);
  const increment = () => {
    setCount(count +1);
  }
  const decrement = () => {
    setCount(count -1);
  }
  return (
    <StyledCounter>
      <Paragraph>{count}</Paragraph>
      <Button onClick={increment}>
        +
      </Button>
      <Button onClick={decrement}>
        -
      </Button>
    </StyledCounter>
  );
}
```

### 伪元素、伪选择器和嵌套

```jsx {3,6,9,12,15}
const Thing = styled.div.attrs((/* props */) => ({ tabIndex: 0 }))`
  color: blue;
  &:hover {              /* <Thing> 悬停时 */
    color: red;
  }
  & ~ & {                /* <Thing> 作为 <Thing> 的兄弟，但可能不直接在它旁边 */
    background: tomato;
  }
  & + & {                /* <Thing> 旁边的 <Thing> */
    background: lime;
  }
  &.something {          /* <Thing> 标记有一个额外的 CSS 类 “.something” */
    background: orange;
  }
  .something-else & {    /* <Thing> 在另一个标记为 “.something-else” 的元素中 */
    border: 1px solid;
  }
`;

render(
  <React.Fragment>
    <Thing>Hello world!</Thing>
    <Thing>你怎么样？</Thing>
    <Thing className="something">
      艳阳高照...
    </Thing>
    <div>今天真是美好的一天。</div>
    <Thing>你不觉得吗？</Thing>
    <div className="something-else">
      <Thing>灿烂</Thing>
    </div>
  </React.Fragment>
);
```

### 改变 styled 组件样式

```jsx {13,21}
import { css } from 'styled-components'
import styled from 'styled-components'

const Input = styled.input.attrs({
  type: "checkbox"
})``;
const LabelText = styled.span`
  ${(props) => {
    switch (props.$mode) {
      case "dark":
        return css`
          color: white;
          ${Input}:checked + && {
            color: blue;
          }
        `;
      default:
        return css`
          color: black;
          ${Input}:checked + && {
            color: red;
          }
        `;
    }
  }}
`;

function Example() {
  return (
    <React.Fragment>
      <Label>
        <Input defaultChecked />
        <LabelText>Foo</LabelText>
      </Label>
      <Label>
        <Input />
        <LabelText $mode="dark">
          Foo
        </LabelText>
      </Label>
    </React.Fragment>
  );
}
```

### 全局样式 createGlobalStyle

```jsx {3,11}
import {
  styled,
  createGlobalStyle
} from 'styled-components'

const Thing = styled.div`
   && {
     color: blue;
   }
`;
const GlobalStyle = createGlobalStyle`
  div${Thing} {
    color: red;
  }
`;

const Example = () => (
  <React.Fragment>
    <GlobalStyle />
    <Thing>
      我是蓝色的
    </Thing>
  </React.Fragment>
);
```

### className 使用

```JSX
const Thing = styled.div`
  color: blue;
  /* <Thing> 中标记为“.something”的元素 */
  .something {
    border: 1px solid;
  }
`;

function Example() {
  return (
    <Thing>
      <label
        htmlFor="foo-button"
        className="something"
      >
        神秘按钮
      </label>
      <button id="foo-button">
        我该怎么办？
      </button>
    </Thing>
  )
}
```

### 共享样式片段

```jsx
const rotate = keyframes`
  from {top:0px;}
  to {top:200px;}
`;

// ❌ 这将引发错误！
const styles = `
  animation: ${rotate} 2s linear infinite;
`;

// ✅ 这将按预期工作
const styles = css`
  animation: ${rotate} 2s linear infinite;
`;
```

### Class 组件样式定义

```jsx {5}
class NewHeader extends React.Component {
  render() {
    return (
      <div
        className={this.props.className}
      />
    );
  }
}
const StyledA = styled(NewHeader)``
const Box = styled.div`
  ${StyledA} {
    /* 变更 NewHeader 样式 */
  }
`;
```

### 附加额外的 Props

```jsx {3,5,13,14,23}
const Input = styled.input.attrs(props=>({
  // 我们可以定义静态道具
  type: "text",
  // 或者我们可以定义动态的
  size: props.size || "1em",
}))`
  color: palevioletred;
  font-size: 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;

  /* 这里我们使用动态计算的 props */
  margin: ${props => props.size};
  padding: ${props => props.size};
`;
```

使用 `Input` 组件

```jsx
function Example() {
  return (
    <div>
      <Input placeholder="小文本输入" />
      <br />
      <Input
        placeholder="更大的文本输入"
        size="2em"
      />
    </div>
  )
}
```

### 覆盖 .attrs

```jsx {11}
const Input = styled.input.attrs(props=>({
  type: "text",
  size: props.size || "1em",
}))`
  border: 2px solid palevioletred;
  margin: ${props => props.size};
  padding: ${props => props.size};
`;
// Input 的attrs会先被应用，然后这个 attrs obj
const PasswordInput = styled(Input).attrs({
  type: "password",
})`
  /* 同样，border 将覆盖 Input 的边框 */
  border: 2px solid aqua;
`;
```

使用 `Input` 和 `PasswordInput` 组件

```jsx {5,11}
render(
  <div>
    <Input
      placeholder="更大的文本输入"
      size="2em"
    />
    <br />
    {/*⚠️ 仍然可以使用Input中的 size attr*/}
    <PasswordInput
      placeholder="更大的密码输入"
      size="2em"
    />
  </div>
);
```

### 动画

创建关键帧

```jsx
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;
```

我们创建一个 `Rotate` 组件

```jsx
// 它将在两秒内旋转我们传递的所有内容
const Rotate = styled.div`
  display: inline-block;
  animation: ${rotate} 2s linear infinite;
  padding: 2rem 1rem;
  font-size: 1.2rem;
`;
```

使用 `Rotate` 组件

```jsx
function Example() {
  return (
    <Rotate>&lt; 💅🏾 &gt;</Rotate>
  )
}
```

### isStyledComponent

```jsx
import React from 'react'
import styled, { isStyledComponent } from 'styled-components'
import MaybeStyledComponent from './my'

let TargetedComponent = isStyledComponent(MaybeStyledComponent)
  ? MaybeStyledComponent
  : styled(MaybeStyledComponent)``;

const ParentComponent = styled.div`
  color: cornflowerblue;

  ${TargetedComponent} {
    color: tomato;
  }
`;
```

### ThemeConsumer

```jsx
import {
  ThemeConsumer
} from 'styled-components'

function Example() {
  return (
    <ThemeConsumer>
      {theme => (
        <div>主题色是 {theme.color}</div>
      )}
    </ThemeConsumer>
  );
}
```

TypeScript
----

### 安装

Web 应用上安装 styled

```bash
npm install -D @types/styled-components
```

React Native 应用上安装 styled

```bash
npm install -D \
    @types/styled-components \
    @types/styled-components-react-native
```

如果对 TypeScript 不熟悉，参考 [TypeScript 备忘清单](./typescript.md)

### 自定义 Props

```tsx
import styled from 'styled-components';

interface TitleProps {
  readonly isActive: boolean;
}

const Title = styled.h1<TitleProps>`
  color: ${(props) => (
    props.isActive 
      ? props.theme.colors.main 
      : props.theme.colors.secondary
  )};
`;
```

### 简单的 Props 类型定义

```tsx
import styled from 'styled-components';
import Header from './Header';

const Header = styled.header`
  font-size: 12px;
`;

const NewHeader = styled(Header)<{
  customColor: string;
}>`
  color: ${(props) => props.customColor};
`;
```

### 禁止转移到子组件($)

```tsx {5}
import styled from 'styled-components';
import Header from './Header';

interface ReHeader {
  $customColor: string;
}

const ReHeader = styled(Header)<ReHeader>`
  color: ${
    props => props.$customColor
  };
`;
```

禁止 `customColor` 属性转移到 `Header` 组件，在其前面加上美元(`$`)符号

### 函数组件类型继承

```tsx {8,13}
import { FC, PropsWithRef, DetailedHTMLProps, ImgHTMLAttributes } from 'react';
import styled from 'styled-components';

const Img = styled.img`
  height: 32px;
  width: 32px;
`;
export interface ImageProps extends DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement
> {
  text?: string;
};
export const Image: FC<PropsWithRef<ImageProps>> = (props) => (
  <Img src="" alt="" {...props} />
);
```

React Native
----

### 基础实例

```jsx
import React from 'react'
import styled from 'styled-components/native'

const StyledView = styled.View`
  background-color: papayawhip;
`;
const StyledText = styled.Text`
  color: palevioletred;
`;

class MyReactNativeComponent extends React.Component {
  render() {
    return (
      <StyledView>
        <StyledText>Hello World!</StyledText>
      </StyledView>
    );
  }
}
```

### React Native 中写 CSS

```jsx
import styled from 'styled-components/native'

const RotatedBox = styled.View`
  transform: rotate(90deg);
  text-shadow-offset: 10px 5px;
  font-variant: small-caps;
  margin: 5px 7px 2px;
`;

function Example() {
  return (
    <RotatedBox />
  )
}
```

与 web 版本的一些区别是，您不能使用关键帧(`keyframes`)和 `createGlobalStyle` 助手，因为 React Native 不支持关键帧或全局样式。如果您使用媒体查询或嵌套 CSS，我们也会警告您。

高级用法
----

### 主题化

```jsx
import styled, { ThemeProvider } from 'styled-components'

// 定义我们的按钮，但这次使用 props.theme
const Button = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;

  /* 使用 theme.main 为边框和文本着色 */
  color: ${props => props.theme.main};
  border: 2px solid ${props => props.theme.main};
`;

// 我们正在为未包装在 ThemeProvider 中的按钮传递默认主题
Button.defaultProps = {
  theme: {
    main: "palevioletred"
  }
}

// 定义 props.theme 的外观
const theme = {
  main: "mediumseagreen"
};

render(
  <div>
    <Button>Normal</Button>

    <ThemeProvider theme={theme}>
      <Button>Themed</Button>
    </ThemeProvider>
  </div>
);
```

### 功能主题

```jsx
import styled, { ThemeProvider } from 'styled-components'

// 定义我们的按钮，但这次使用 props.theme
const Button = styled.button`
  color: ${props => props.theme.fg};
  border: 2px solid ${props => props.theme.fg};
  background: ${props => props.theme.bg};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;
`;
// 在主题上定义我们的`fg`和`bg`
const theme = {
  fg: "palevioletred",
  bg: "white"
};

// 这个主题交换了`fg`和`bg`
const invertTheme = ({ fg, bg }) => ({
  fg: bg,
  bg: fg
});

render(
  <ThemeProvider theme={theme}>
    <div>
      <Button>默认主题</Button>
      <ThemeProvider theme={invertTheme}>
        <Button>反转主题</Button>
      </ThemeProvider>
    </div>
  </ThemeProvider>
);
```

### 通过 withTheme 高阶组件

```jsx
import { withTheme } from 'styled-components'

class MyComponent extends React.Component {
  render() {
    console.log('Current theme: ', this.props.theme)
    // ...
  }
}

export default withTheme(MyComponent)
```

### useContext 钩子

```jsx
import { useContext } from 'react'
import { ThemeContext } from 'styled-components'

const MyComponent = () => {
  const themeContext = useContext(ThemeContext)
  
  console.log('Current theme: ', themeContext)
  // ...
}
```

### useTheme 自定义钩子

```jsx
import {useTheme} from 'styled-components'

const MyComponent = () => {
  const theme = useTheme()

  console.log('Current theme: ', theme)
  // ...
}
```

### 主题 props

```jsx
import {
  ThemeProvider,
  styled
} from 'styled-components';

// 定义我们的按钮
const Button = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  /* 使用 theme.main 为边框和文本着色 */
  color: ${props => props.theme.main};
  border: 2px solid ${props => props.theme.main};
`;
// 定义主题的外观
const theme = {
  main: "mediumseagreen"
};
```

使用自定义主题组件

```jsx
render(
  <div>
    <Button theme={{ main: "royalblue" }}>
      特设主题
    </Button>
    <ThemeProvider theme={theme}>
      <div>
        <Button>Themed</Button>
        <Button
          theme={{ main: "darkorange" }}
        >
          被覆盖
        </Button>
      </div>
    </ThemeProvider>
  </div>
);
```

### Refs

```jsx
import {
  ThemeProvider,
  styled
} from 'styled-components';

const Input = styled.input`
  border: none;
  border-radius: 3px;
`;

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  render() {
    return (
      <Input
        ref={this.inputRef}
        placeholder="Hover to focus!"
        onMouseEnter={() => {
          this.inputRef.current.focus()
        }}
      />
    );
  }
}
```

使用 `Form` 组件

```jsx
function Example() {
  return (
    <Form />
  )
}
```

### 特异性问题

在文件 `MyComponent.js` 中定义 `MyComponent` 组件。

```jsx
const MyComponent = styled.div`
  background-color: green;
`;
```

定义样式 `my-component.css`

```css
.red-bg {
  background-color: red;
}
```

使用 `MyComponent` 组件

```jsx
<MyComponent className="red-bg" />
```

由于某种原因，这个组件仍然有绿色背景，即使你试图用 `red-bg` 类覆盖它！

#### 解决方案

```css
.red-bg.red-bg {
  background-color: red;
}
```

### ThemeProvider

```jsx
import styled, { ThemeProvider } from 'styled-components'

const Box = styled.div`
  color: ${props => props.theme.color};
`;

const Example = () => (
  <ThemeProvider theme={{ color: 'mediumseagreen' }}>
    <Box>I'm mediumseagreen!</Box>
  </ThemeProvider>
);
```

### shouldForwardProp

```jsx
const Comp = styled('div').withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) =>
      !['hidden'].includes(prop) && defaultValidatorFn(prop),
}).attrs({ className: 'foo' })`
  color: red;
  &.foo {
    text-decoration: underline;
  }
`;

const Example = () => (
  <Comp hidden draggable="true">
    Drag Me!
  </Comp>
);
```
