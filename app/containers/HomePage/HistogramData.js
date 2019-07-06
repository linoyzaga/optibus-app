import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import moment from 'moment';
import H1 from '../../components/H1';
import { ABC } from './consts';
import API from '../../API/api';

export default class HistogramData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      drivers: [],
      error: null,
    };

    this.buildDataForHistogram = this.buildDataForHistogram.bind(this);
    this.calcStop = this.calcStop.bind(this);
    this.calcRange = this.calcRange.bind(this);
  }

  componentDidMount() {
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

  buildDataForHistogram() {
    const diff = {};
    const start = this.props.selectedColumn.key.substr(0, this.props.selectedColumn.key.indexOf('-'));
    const stop = this.props.selectedColumn.key.substr(this.props.selectedColumn.key.indexOf('-') + 1);

    this.state.drivers.forEach((drive) => {
      if (drive.stop_id === stop) {
        const realTime = this.calcStop(start, drive.trip_id, drive.time);

        const range = this.calcRange(drive);

        const averageTime = range[0][this.props.selectedColumn.key]
        const diffTime = Math.abs(realTime - averageTime);

        if (diffTime > 1) {
          const rangeKey = `${range[0].start}-${range[0].end}`
          if (!diff[rangeKey]) {
            diff[rangeKey] = {
              name: rangeKey,
              pv: 0,
              uv: 0,
            };
          }

          realTime < averageTime ? diff[rangeKey].pv++ : diff[rangeKey].uv++;
        }
      }
    });

    return Object.keys(diff).map((key) => {
      return { ...diff[key] };
    });
  }

  calcStop(start, tripId, time) {
    let prevStop = null;

    this.state.drivers.map((drive) => {
      if (drive.trip_id === tripId && drive.stop_id === start) {
        prevStop = drive;
      }
    });

    return moment(time).diff(moment(prevStop.time)) / 60000;
  }

  calcRange(drive) {
    return this.props.times.filter((time) => {
      const currTime = moment.utc(drive.time).format('kk:mm:ss');
      const beforeTime = moment.utc(time.start, 'kk:mm:ss');
      const afterTime = moment.utc(time.end, 'kk:mm:ss');
      const newCurrTime = moment.utc(currTime, 'kk:mm:ss');
      return newCurrTime.isBetween(beforeTime, afterTime, null, '[]');
    })
  }

  render() {
    return (<div>
      <H1> {ABC[this.props.selectedColumn.key]} </H1>
      <BarChart
        width={1000}
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
        <Bar dataKey="uv" name="More" fill="#8884d8" />
        <Bar dataKey="pv" name="Less" fill="#82ca9d" />
      </BarChart>
    </div>);
  }
}
