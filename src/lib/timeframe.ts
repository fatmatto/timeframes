import { TimeSerie } from "./timeserie";
import { Point, Row, TelemetryV1Output, TimeFrameInternal } from "./types";

/**
 * Timeseries oriented dataframe
 */
export class TimeFrame {
  readonly data: TimeFrameInternal;
  readonly columns: readonly string[];
  /**
   * 
   * @param data An object which is telemetry V1 output {device1: {property1:[[time,value]],property2:[[time,value]]}}
   * @returns 
   */
  static fromTelemetryV1Output(data: TelemetryV1Output = {}) : TimeFrame {
    const _data: TimeFrameInternal = {};
    for (const deviceId in data) {
      for (const propertyName in data[deviceId]) {
        for (const [time, value] of data[deviceId][propertyName]) {
          if (!_data[time]) {
            _data[time] = {};
          }
          const column = `${deviceId}:${propertyName}`;
          _data[time][column] = value;

        }
      }
    }
    const rows = Object.keys(_data).map((time: string) => {
      return { time, ..._data[time] }
    })
    return new TimeFrame(rows)
  }

  static fromInternalFormat(data: TimeFrameInternal) : TimeFrame {
    return new TimeFrame(Object.keys(data).map((time: string) => {
      return { time, ...data[time] }
    }))
  }

  static fromTimeseries(timeseries: TimeSerie[]) : TimeFrame {
    const data: TimeFrameInternal = {}

    timeseries.forEach(ts => {
      ts.toArray().forEach((point: Point) => {
        data[point[0]] = data[point[0]] || {}
        data[point[0]][ts.name] = point[1]
      })
    })
    return TimeFrame.fromInternalFormat(data)
  }

  /**
   * Concatenates timeframes. Throws error if overlapping times are found. Use merge to join together
   * timeframes with overlapping times
   * @param timeframes Array of timeframes to concatenate
   */
  // static concat(timeframes: TimeFrame[])  : TimeFrame{

  // }

  /**
   * 
   * @param timeframes Array of timeframes to join together
   * @returns A timeframe with joined columns
   */
  static join(timeframes: TimeFrame[]): TimeFrame {
    return TimeFrame.fromInternalFormat(Object.assign({},...timeframes.map(tf => tf.data)))
  }

  /**
   * Creates a Timeframe instance from a list of rows. It infers the list of column names from each row's fields.
   * @param rows Array of rows
   */
  constructor(rows: readonly Row[] = []) {
    this.columns = [...new Set(rows.map((row: Row) => Object.keys(row)).flat())].filter((name: string) => name !== 'time')
    this.data = rows.reduce((acc: TimeFrameInternal, row:Row) => {
      const {time, ...rest} = row
      acc[row.time] ? acc[row.time] = { ...acc[row.time], ...rest } : acc[row.time] = rest
      return acc
    },{}) 
  }

  /**
   * 
   * @param name The name of the wanted column
   * @returns The column as timeseries
   */
  column(name: string): TimeSerie {
    return new TimeSerie(name,Object.entries(this.data).map(([time, values]) => ([time, values[name]])))
  }
  /**
   * 
   * @returns Array of rows
   */
  toArray(): readonly Row[] {
    return Object.entries(this.data).map(([time,values]) => ({time,...values}))
  }
  /**
   * 
   * @param time 
   * @returns A row at a given time or null
   */
  atTime(time: string): Row | null {
    return {time,...this.data[time]} || null
  }
}
