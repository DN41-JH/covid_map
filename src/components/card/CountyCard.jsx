// Card Component obtained from Material-UI: https://material-ui.com/components/cards/

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function CountyCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          County: {props.county}
        </Typography>
        <Typography variant="h5" component="h2">
          Confirmed: {props.stats.confirmed}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Deaths: {props.stats.deaths}
        </Typography>
        <Typography variant="body2" component="p">
          Recovered: {props.stats.recovered ? props.stats.recovered : "Unavailable"}
        </Typography>
      </CardContent>
    </Card>
  );
}
