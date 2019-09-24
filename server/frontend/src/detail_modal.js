// detail_modal.js
import React, {Component} from 'react';
import Detail from './detail'
import 'semantic-ui-css/semantic.min.css';
import { Modal, Button } from 'semantic-ui-react';

function DetailModal({ match, location, history }) {
  let jobid = match.params.jobid;
  let goBack = ()=> history.push('/');

  return (

    <Modal size="small" open={true} onClose={goBack}>
      <Modal.Header>Job detail</Modal.Header>
      <Modal.Content>
        <Detail jobid={jobid} />
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={goBack}>Close</Button>
      </Modal.Actions>
    </Modal>

  );
};


export default DetailModal;