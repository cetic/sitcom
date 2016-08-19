import Select from 'react-select'

class FieldsFilter extends React.Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     options:    [],
  //     fieldIds: this.props.fieldIds || ''
  //   };
  // }

  // componentDidMount() {
  //   this.reloadOptionsFromBackend()
  // }

  // reloadOptionsFromBackend() {
  //   $.get(this.props.fieldOptionsPath, (data) => {
  //     var camelData = humps.camelizeKeys(data);

  //     this.setState({
  //       options: camelData
  //     });
  //   });
  // }

  // udpdateValue(value) {
  //   this.setState({ fieldIds: value }, () => {
  //     this.props.updateFieldIds(value);
  //   });
  // }

  // render() {
  //   return (
  //     <div>
  //       <label>Projets</label>
  //       <Select multi={true}
  //               value={this.state.fieldIds}
  //               options={this.state.options}
  //               onChange={this.udpdateValue.bind(this)} />
  //     </div>
  //   )
  // }
}

module.exports = FieldsFilter
