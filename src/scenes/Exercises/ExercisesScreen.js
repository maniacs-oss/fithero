/* @flow */

import React, { Component } from 'react';
import { FlatList, Keyboard, Platform, StyleSheet, View } from 'react-native';
import { IconButton, Searchbar } from 'react-native-paper';
import { exercises as dzikuExercises } from 'dziku-exercises';
import sortBy from 'lodash/sortBy';

import Screen from '../../components/Screen';
import ExerciseItem from './ExerciseItem';
import ExerciseHeader from './ExerciseHeader';
import type { NavigationType, RealmResults } from '../../types';
import ChipsCategory from '../../components/ChipsCategory';
import { mapCategories, mainCategories } from '../../utils/muscles';
import i18n from '../../utils/i18n';
import { getExerciseName } from '../../utils/exercises';
import type { ThemeType } from '../../utils/theme/withTheme';
import withTheme from '../../utils/theme/withTheme';
import HeaderIconButton from '../../components/HeaderIconButton';
import type { ExerciseSchemaType } from '../../database/types';
import { getAllExercises } from '../../database/services/ExerciseService';
import { deserializeExercises } from '../../database/utils';
import { getDefaultNavigationOptions } from '../../utils/navigation';
import type { AppThemeType } from '../../redux/modules/settings';

type NavigationObjectType = {
  navigation: NavigationType<{
    day: string,
  }>,
};

type NavigationOptions = NavigationObjectType & {
  screenProps: {
    theme: AppThemeType,
  },
};

type Props = NavigationObjectType & {
  theme: ThemeType,
};

type State = {
  exercises: Array<ExerciseSchemaType>,
  searchQuery: string,
  tagSelection: { [key: string]: boolean },
};

export class ExercisesScreen extends Component<Props, State> {
  realmExercises: RealmResults<ExerciseSchemaType>;

  static navigationOptions = ({
    navigation,
    screenProps,
  }: NavigationOptions) => ({
    ...getDefaultNavigationOptions(screenProps.theme),
    ...Platform.select({
      android: { header: null },
    }),
    headerRight: (
      <HeaderIconButton
        onPress={() => navigation.navigate('EditExercise')}
        icon="add"
        last
      />
    ),
  });

  constructor(props: Props) {
    super(props);
    this.realmExercises = getAllExercises();
    // We don't want to mix Realm objects and normal objects into the state because it gives
    // a lot of problems when for example, the Restore function deletes all the database.
    // The user will not often add, modify or delete exercises so deserialize here is acceptable
    const customExercises = deserializeExercises(this.realmExercises);
    this.state = {
      exercises: sortBy([...customExercises, ...dzikuExercises], e =>
        getExerciseName(e.id, e.name)
      ),
      searchQuery: '',
      tagSelection: Object.assign(
        {},
        ...mainCategories.map(item => ({ [item.id]: false }))
      ),
    };
  }

  componentDidMount() {
    this.realmExercises.addListener((exercises, changes) => {
      if (
        changes.insertions.length > 0 ||
        changes.modifications.length > 0 ||
        changes.deletions.length > 0
      ) {
        const realmExercises = getAllExercises();
        const customExercises = deserializeExercises(realmExercises);
        this.setState({
          exercises: sortBy([...customExercises, ...dzikuExercises], e =>
            getExerciseName(e.id, e.name)
          ),
        });
      }
    });
  }

  componentWillUnmount() {
    this.realmExercises.removeAllListeners();
  }

  _onExercisePress = (exercise: ExerciseSchemaType) => {
    const { day } = this.props.navigation.state.params;

    if (Platform.OS === 'android') {
      // It already works on iOS
      Keyboard.dismiss();
    }

    this.props.navigation.navigate('EditSets', {
      day,
      exerciseKey: exercise.id,
      exerciseName: exercise.name,
    });
  };

  _keyExtractor = item => item.id;

  _renderItem = ({ item }) => (
    <ExerciseItem
      exercise={item}
      navigate={this.props.navigation.navigate}
      onPressItem={this._onExercisePress}
    />
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
      return this.state.exercises;
    }
    return this._getFilterData(searchQuery, tagSelection, hasTagsSelected);
  }

  _getFilterData(searchQuery, tagSelection, hasTagsSelected) {
    function escapeSpecialChars(regex) {
      return regex.replace(/([()[{*+.$^\\|?])/g, '\\$1');
    }

    return this.state.exercises.filter(e => {
      const exerciseName = getExerciseName(e.id, e.name);
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
      <View style={styles.listHeader}>
        <ExerciseHeader day={day} style={styles.header} />
        <ChipsCategory
          items={mainCategories}
          selection={this.state.tagSelection}
          onSelect={this._onSelectCategory}
        />
      </View>
    );
  };

  _onAddExercise = () => {
    this.props.navigation.navigate('EditExercise');
  };

  render() {
    const { searchQuery, tagSelection } = this.state;
    const {
      theme: { colors },
    } = this.props;

    return (
      <Screen>
        <View style={styles.searchToolbar}>
          <Searchbar
            style={[styles.searchBar]}
            onChangeText={this._onSearchChange}
            placeholder={i18n.t('search')}
            icon={Platform.OS === 'android' ? 'arrow-back' : 'search'}
            value={searchQuery}
            onIconPress={Platform.OS === 'android' ? this._goBack : undefined}
            theme={{ colors: { primary: colors.textSelection } }}
          />
          {Platform.OS === 'android' && (
            <IconButton
              onPress={this._onAddExercise}
              icon="add"
              style={styles.clearAndroid}
            />
          )}
        </View>
        <FlatList
          data={this._getData(searchQuery, tagSelection)}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ListHeaderComponent={this._renderHeader}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.list}
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
    marginHorizontal: 8,
    ...Platform.select({
      android: {
        elevation: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
      },
      ios: { marginTop: 4 },
    }),
  },
  searchBar: {
    elevation: 0,
    paddingHorizontal: 4,
    ...Platform.select({
      ios: { height: 44 },
      android: { flex: 1, height: 48, paddingRight: 42 },
    }),
  },
  clearAndroid: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  listHeader: {
    paddingBottom: 8,
  },
  list: {
    paddingTop: 4,
  },
});

export default withTheme(ExercisesScreen);
