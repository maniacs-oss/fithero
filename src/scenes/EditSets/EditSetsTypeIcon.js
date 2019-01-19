/* @flow */

import React from 'react';
import { connect } from 'react-redux';

import HeaderIconButton from '../../components/HeaderIconButton';
import { setEditSetsScreenType } from '../../redux/modules/settings';
import type { EditSetsScreenType } from '../../redux/modules/settings';

type Props = {
  editSetsScreenType: EditSetsScreenType,
  setEditSetsScreenType: (value: EditSetsScreenType) => void,
};

class EditSetsTypeIcon extends React.Component<Props> {
  _setEditSetsScreenType = () => {
    this.props.setEditSetsScreenType(
      this.props.editSetsScreenType === 'paper' ? 'list' : 'paper'
    );
  };

  render() {
    return (
      <HeaderIconButton
        icon={
          this.props.editSetsScreenType === 'list'
            ? 'description'
            : 'format-list-bulleted'
        }
        onPress={this._setEditSetsScreenType}
      />
    );
  }
}

export default connect(
  state => ({
    editSetsScreenType: state.settings.editSetsScreenType,
  }),
  {
    setEditSetsScreenType,
  }
)(EditSetsTypeIcon);
