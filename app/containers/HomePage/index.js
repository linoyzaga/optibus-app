import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Table } from 'antd';
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
    this.buildChart = this.buildChart.bind(this);
    this.buildDataForHistogram = this.buildDataForHistogram.bind(this);
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

    API.getDrivers().then((res) => {
      this.setState({
        drivers: res.data,
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

  buildChart() {
    if (this.state.selectedColumn) {
      return (
        <div>
          <H1> {ABC[this.state.selectedColumn.key]} </H1>
          <BarChart
            width={500}
            height={300}
            data={this.buildDataForHistogram()}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#8884d8" />
          </BarChart>
        </div>
      );
    }

    return null;
  }

  buildDataForHistogram() {
    const pv = 9;
    const differs = {};
    const key = this.state.selectedColumn.key.substr(this.state.selectedColumn.key.indexOf('-') + 1);

    this.state.drivers.map((drive) => {
      if (drive.stop_id === key) {
        differs.key = '';
      }
    });

    return this.state.times.map((time) => ({
      name: `${time.start}-${time.end}`,
      pv,
    }));
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
      {this.buildChart()}
    </div>);
  }
}
