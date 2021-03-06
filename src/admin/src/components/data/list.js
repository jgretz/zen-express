import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Table } from 'react-bootstrap';
import humanizePlus from 'humanize-plus';
import autobind from 'class-autobind';

import { loadObjects } from 'actions';
import { filterById, goto } from 'support';
import ListRow from './list_row';

class DataList extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = { model: null };
  }

  // load
  componentWillMount() {
    this.loadProps(this.props.schema, this.props.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id && nextProps.params.id !== this.props.params.id) {
      this.loadProps(this.props.schema, nextProps.params.id);
    }

    if (nextProps.schema && nextProps.schema !== this.props.schema) {
      this.loadProps(nextProps.schema, this.props.params.id);
    }
  }

  loadProps(schema, id) {
    const model = filterById(schema, id, null);
    if (!model) {
      return;
    }

    this.setState({ model });
    this.props.loadObjects(model);
  }

  displayProps() {
    return _.filter(this.state.model.fields, f => f.showInList);
  }

  // click handlers
  newObject() {
    goto(`data/${this.props.params.id}/new`);
  }

  // render
  renderHeader() {
    if (!this.state.model) {
      return null;
    }

    return (
      <div>
        <Button bsStyle="success" className="pull-right new" onClick={this.newObject}>
          New
        </Button>
        <h4>
          {this.state.model.name}
        </h4>
      </div>
    );
  }

  renderTableHeader() {
    if (!this.state.model) {
      return null;
    }

    return (
      <thead>
        <tr>
          {
            this.displayProps().map(field =>
            (
              <th key={field.name} className="header">
                {humanizePlus.capitalize(field.name)}
              </th>
            ))
          }
          <th />
        </tr>
      </thead>
    );
  }

  renderObjects() {
    if (!this.state.model) {
      return null;
    }

    const data = this.props.data[this.state.model.url];
    if (!data) {
      return null;
    }

    return (
      <tbody>
        {
          data.map(obj =>
            <ListRow
              key={obj._id}
              object={obj}
              displayProps={this.displayProps()}
              dataTypeId={this.props.params.id}
            />)
        }
      </tbody>
    );
  }

  render() {
    return (
      <div className="data-list">
        <Row>
          <Col xs={12}>
            {this.renderHeader()}
            <hr />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Table striped bordered condensed hover>
              {this.renderTableHeader()}
              {this.renderObjects()}
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}

DataList.propTypes = {
  params: PropTypes.object.isRequired,
  schema: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired,

  loadObjects: PropTypes.func.isRequired,
};

const mapStateToProps = ({ schema, data }) => ({ schema, data });

export default connect(mapStateToProps, { loadObjects })(DataList);
