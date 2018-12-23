/* @flow */

import React, { Component } from 'react';
import { FlatList, Keyboard, Platform, StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';

import exercises from '../../data/exercises.json';
import Screen from '../../components/Screen';
import ExerciseItem from './ExerciseItem';
import ExerciseHeader from './ExerciseHeader';
import type { NavigationType } from '../../types';
import ChipsCategory from '../../components/ChipsCategory';
import { mapCategories, mainCategories } from '../../utils/muscles';
import i18n from '../../utils/i18n';
import { getExerciseName } from '../../utils/exercises';
import type { ThemeType } from '../../utils/theme/withTheme';
import withTheme from '../../utils/theme/withTheme';

type Props = {
  navigation: NavigationType<{ day: string }>,
  theme: ThemeType,
};

type State = {
  searchQuery: string,
  tagSelection: { [key: string]: boolean },
};

export class ExercisesScreen extends Component<Props, State> {
  static navigationOptions = {
    ...Platform.select({
      android: { header: null },
    }),
  };

  state = {
    searchQuery: '',
    tagSelection: Object.assign(
      {},
      ...mainCategories.map(item => ({ [item.id]: false }))
    ),
  };

  _onExerciseToggle = (exerciseKey: string) => {
    const { day } = this.props.navigation.state.params;

    if (Platform.OS === 'android') {
      // It already works on iOS
      Keyboard.dismiss();
    }

    this.props.navigation.navigate('EditSets', { day, exerciseKey });
  };

  _keyExtractor = item => item.id;

  _renderItem = ({ item }) => (
    <ExerciseItem exercise={item} onPressItem={this._onExerciseToggle} />
  );

  _onSelectCategory = (id: string) => {
    this.setState(prevState => ({
      tagSelection: {
        ...prevState.tagSelection,
        [id]: !prevState.tagSelection[id],
      },
    }));
  };

  _onSearchChange = (value: string) => {
    this.setState({ searchQuery: value });
  };

  _getData(searchQuery, tagSelection) {
    const hasTagsSelected = !!Object.values(tagSelection).find(t => t === true);
    if (!searchQuery && !hasTagsSelected) {
      return exercises;
    }
    return this._getFilterData(searchQuery, tagSelection, hasTagsSelected);
  }

  _getFilterData(searchQuery, tagSelection, hasTagsSelected) {
    function escapeSpecialChars(regex) {
      return regex.replace(/([()[{*+.$^\\|?])/g, '\\$1');
    }

    return exercises.filter(e => {
      const exerciseName = getExerciseName(e.id);
      const matchesSearch =
        exerciseName
          .toLowerCase()
          .trim()
          .search(escapeSpecialChars(searchQuery.toLowerCase().trim())) > -1;

      // There is search query and tags
      if (hasTagsSelected && matchesSearch) {
        for (let i = 0; i < e.primary.length; i++) {
          if (tagSelection[mapCategories[e.primary[i]]]) {
            return true;
          }
        }
        // There are no tags but matches the search
      } else if (!hasTagsSelected && matchesSearch) {
        return true;
      }
      return false;
    });
  }

  _goBack = () => {
    this.props.navigation.goBack(null);
  };

  _renderHeader = () => {
    const { day } = this.props.navigation.state.params;
    return (
      <View>
        <ExerciseHeader day={day} style={styles.header} />
        <ChipsCategory
          items={mainCategories}
          selection={this.state.tagSelection}
          onSelect={this._onSelectCategory}
        />
      </View>
    );
  };

  render() {
    const { searchQuery, tagSelection } = this.state;
    const {
      theme: { colors },
    } = this.props;

    return (
      <Screen>
        <View
          style={[styles.searchToolbar, { backgroundColor: colors.toolbar }]}
        >
          {/* $FlowFixMe problems with the theme from Paper */}
          <Searchbar
            style={styles.searchBar}
            onChangeText={this._onSearchChange}
            placeholder={i18n.t('search')}
            icon={Platform.OS === 'android' ? 'arrow-back' : 'search'}
            value={searchQuery}
            onIconPress={Platform.OS === 'android' ? this._goBack : undefined}
            theme={{ colors: { primary: colors.textSelection } }}
          />
        </View>
        <FlatList
          data={this._getData(searchQuery, tagSelection)}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ListHeaderComponent={this._renderHeader}
          keyboardShouldPersistTaps="always"
        />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  searchToolbar: {
    elevation: 0,
  },
  searchBar: {
    margin: 8,
    ...Platform.select({
      ios: { height: 40, marginTop: 4 },
    }),
  },
});

export default withTheme(ExercisesScreen);
