## Example Usage

```js
class MyComponent extends Component {
  ...
}

const createPollingOptions = dispatch => {
  return {
    pollFn: bindActionCreators(actionCreator, dispatch),
    frequency: 5000 // optional
  };
};

export default withPolling(createPollingOptions)(MyComponent);
```
