// "Map" Component obtained from https://www.npmjs.com/package/google-map-react

import React from 'react';
import GoogleMapReact from 'google-map-react';
import CountyCard from '../card/CountyCard';
import StateCard from '../card/StateCard';
import NationCard from '../card/NationCard';
import { MapService } from '../../services/MapService';
import { MapUtils } from '../../utils/MapUtils';
 
const PointMarker = ({ children }) => children;

export default class Map extends React.Component {
  static defaultProps = {
    center: {
      lat: 50,
      lng: -90,
    },
    zoom: 4
  };

  constructor(props) {
      super(props)

      this.state = {
          boundary: {},
          zoom: 4,
          points: {},
      }
  }
 
  render() {
    console.log(this.state.zoom, this.state.boundary);
    // console.log(this.state.points);

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          // Fill in your personal Google Map API Key below:
          // bootstrapURLKeys={{ key: 'AIzaSyAHQeGX9rhyXdlxXR58OgXnOjGhxduUEAc' }}
          bootstrapURLKeys={{ key: 'AIzaSyB5AWwMnWoRi-AFbfcTBE080pqH6vJak5Y' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          onChange={(changeObject) => {
              this.setState({
                  zoom: changeObject.zoom,
                  boundary: changeObject.bounds
                }
            )
          }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => {
              // 1. Call axios API to get data (XHR)
              // 2. setState() to change the state
              MapService.getUSCovidData()
                .then(response => {
                    // data handleing (response.data)
                    const CovidDataPoints = MapUtils.getCovidPoints(response.data);
                    this.setState({
                        points: CovidDataPoints,
                    });
                })
                .catch(error => { 
                    console.log(error)})
          }}
        >

        {this.renderPoints()}

        </GoogleMapReact>
      </div>
    );
  }

  renderPoints() {
    const points = this.state.points[this.state.zoom];
    const result = [];

    if (!points) {
        return result;
    }

    console.log(this.state.zoom);
    console.log(points);

    // render counties
    if (Array.isArray(points)) {
        for (const county of points) {
            // is point in boundary?
            if (!MapUtils.isInBoundary(this.state.boundary, county.coordinates)) {
                continue;
            }

            result.push(
                <PointMarker
                    key = {county.province + county.county}
                    lat = {county.coordinates.latitude}
                    lng = {county.coordinates.longitude}
                >
                    <CountyCard {...county}/>
                </PointMarker>
            )
        }
    }

    // render states
    if (points.type === 'state') {
        for (const nation in points) {
            for (const state in points[nation]) {
                if (!MapUtils.isInBoundary(this.state.boundary, points[nation][state].coordinates)) {
                    continue;
                }

                result.push(
                    <PointMarker
                        key = {nation + state}
                        lat = {points[nation][state].coordinates.latitude}
                        lng = {points[nation][state].coordinates.longitude}
                    >
                        <StateCard state={state} {...points[nation][state]}/>
                    </PointMarker>
                )
            }
        }
    }

    // homework: render nations
    if (points.type === 'nation') {
        for (const nation in points) {
            if (!MapUtils.isInBoundary(this.state.boundary, points[nation].coordinates)) {
                continue;
            }

            result.push(
                <PointMarker
                    key = {nation}
                    lat = {points[nation].coordinates.latitude}
                    lng = {points[nation].coordinates.longitude}
                >
                    <NationCard nation={nation} {...points[nation]} />
                </PointMarker>
            )
        }
    }

    return result;

  }

};