import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import 'antd/dist/antd.css';
import HomePage from 'containers/HomePage/Loadable';

const AppWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

export default function App() {
  return (
    <AppWrapper>
      <Helmet
        defaultTitle="Optibus"
      >
        <meta name="description" content="Optibus project" />
      </Helmet>
      <Switch>
        <Route exact path="/" component={HomePage} />
      </Switch>
    </AppWrapper>
  );
}
