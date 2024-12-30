import React from 'react';
import { TransitionGroup } from '../internal/react-transition-group.min.js';

// make ValueContainer a transition group
const AnimatedValueContainer = (
  WrappedComponent
) => (props) => (
  <TransitionGroup component={WrappedComponent} {...props} />
);

export default AnimatedValueContainer;
