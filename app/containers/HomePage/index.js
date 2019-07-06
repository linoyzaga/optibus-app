import React from 'react';
import { Table } from 'antd';
import HistogramChart from './HistogramData';
import H1 from '../../components/H1';
import { ABC } from './consts';
import styles from './HomePage.css';
import API from '../../API/api';

const Column = Table.Column;

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      times: null,
      columns: [],
      error: null,
      selectedColumn: null,
    };

    this.buildColumns = this.buildColumns.bind(this);
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

    return keys.map((key) => (
      <Column
        title={titles.includes(key) ? key : ABC[key]}
        dataIndex={key}
        key={key}
        className={styles.timetable}
        onHeaderCell={(column) => ({
          onClick: () => { this.setState({ selectedColumn: column }); },
        })}
      />
    ));
  }

  render() {
    return (<div>
      <H1>Bus Times</H1>
      <Table
        dataSource={this.state.times}
        loading={this.state.times === null}
        size={'small'}
        bordered
        pagination={false}
        rowKey={'start'}
      >
        {this.state.columns}
      </Table>
      {this.state.selectedColumn !== null ? <HistogramChart selectedColumn={this.state.selectedColumn} times={this.state.times}/> : null}
    </div>);
  }
}
