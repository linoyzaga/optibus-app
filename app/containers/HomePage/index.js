import React from 'react';
import { Table } from 'antd';
import H1 from '../../components/H1';
import { ABC } from './consts';
import styles from './HomePage.css';
import API from '../../API/api';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      times: null,
      columns: [],
      error: null,
    };

    this.buildColumns = this.buildColumns.bind(this);
    this.buildName = this.buildName.bind(this);
  }

  componentDidMount() {
    API.getTimes().then((res) => {
      const columns = this.buildColumns(res.data);
      this.setState({
        times: res.data,
        columns,
      });
    }).catch((e) => {
      this.setState({
        error: e.response.data.message,
      });
    });
  }

  buildColumns(data) {
    const keys = Object.keys(data[0]);
    const titles = ['start', 'end'];

    const columns = keys.map((key, index) => ({
      title: titles.includes(key) ? key : this.buildName(index),
      dataIndex: key,
      key,
      className: styles.timetable,
    }));

    return columns;
  }

  buildName(index) {
    return `${ABC[index - 2]} -> ${ABC[index - 1]}`;
  }

  render() {
    return (<div>
      <H1>Bus Times</H1>
      <Table dataSource={this.state.times} columns={this.state.columns} loading={this.state.times === null} size={'small'} bordered={true} />
    </div>);
  }
}
