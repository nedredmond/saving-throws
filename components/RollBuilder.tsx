import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MonoText } from './StyledText';
import { Text, useThemeColor, View } from './Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { transform } from '@babel/core';

export default function RollBuilder() {
  const [dice, setDice] = useState<{ [key: string]: number }>({});
  const [diceListString, setString] = useState('');
  const [totalResult, setTotalResult] = useState(0);
  const [resultsList, setResultsList] = useState<string[]>([]);
  const [dieTypeCount, setDieTypeCount] = useState(0);
  const dieTypes = ["4", "6", "8", "10", "12", "20"];
  const themedTextColor = useThemeColor({ light: "black", dark: "white" }, 'text');
  const inputBackgroundColor = useThemeColor({ light: "rgba(0,0,0,0.05)", dark: "rgba(255,255,255,0.05)" }, 'background');

  function clear() {
    setDice({});
    setDieTypeCount(0);
  }

  useEffect(() => {
    if (!dieTypeCount) {
      setTotalResult(0);
      setResultsList([]);
    }
    let tempString = '';

    let count = dieTypeCount;
    for (let die in dice) {
      tempString += `${dice[die]}d${die}`;
      if (--count) {
        tempString += "+";
      }
    }
    setString(tempString);
  }, [dice])

  function addDieToRoll(die: string) {
    let diceList = { ...dice };
    diceList[die] = diceList[die] ? ++diceList[die] : 1;
    setDice(diceList);
    setDieTypeCount(Object.keys(diceList).length);
  }

  function setDieAmount(die: string, amount: string) {
    if (!amount) return;
    const amountInt = parseInt(amount);
    if (isNaN(amountInt)) return;

    let diceList = { ...dice };
    if (!amountInt) {
      delete diceList[die];
    } else {
      diceList[die] = amountInt;
    }

    setDice(diceList);
    setDieTypeCount(Object.keys(diceList).length);
  }

  function removeDieFromRoll(die: string) {
    let diceList = { ...dice };
    diceList[die] = --diceList[die];
    if (!diceList[die]) {
      delete diceList[die];
    }
    setDice(diceList);
    setDieTypeCount(Object.keys(diceList).length);
  }

  function rollDice() {
    let diceArray: number[] = []
    for (let die in dice) {
      const dieArray = Array(dice[die]).fill(parseInt(die));
      diceArray = [...diceArray, ...dieArray];
    }

    const resultsArray = diceArray.map(die => [die, Math.floor(Math.random() * die) + 1])
    setResultsList(resultsArray.map(([sides, result]) => `[${sides}]: ${result}`));

    const totalResult = resultsArray.reduce((total, dieResult) => total + dieResult[1], 0)
    setTotalResult(totalResult);
  }

  // function parseDiceNotation(notation: string) {
  // const parts = notation.split('+');

  // console.log("NEW ARRAY!!!");
  // const array = regex.test(notation);
  // for (let match of array) {
  //   console.log(match);
  // }
  // console.log("END");

  // var howMany = (typeof match[1] == 'undefined') ? 1 : parseInt(match[1]);
  // var dieSize = parseInt(match[2]);
  // var modifier = (typeof match[3] == 'undefined') ? 0 : parseInt(match[3]);

  // setResult(/^((\d+)?[dD](\d+)\s?)+([+-]\d+)?$/.exec(notation)?.toString() || 'Hella');
  // }

  const addDieButtons = dieTypes.map((die, i) =>

    <View key={die} style={{ marginRight: i === die.length - 1 ? 0 : 1 }}>
      <TouchableOpacity
        onPress={() => addDieToRoll(die)}
        style={styles.button}>
        <MaterialCommunityIcons
          name={`dice-d${die}-outline` as any}
          color={themedTextColor}
          style={styles.title}
        />
      </TouchableOpacity>
    </View>
  );

  const diceInTrayButtons = Object.keys(dice).map((die => {
    return <View key={die}>
      <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
        <TouchableOpacity
          onPress={() => removeDieFromRoll(die)}
          onLongPress={() => removeDieFromRoll(die)}
        >
          <MaterialCommunityIcons
            name={`dice-d${die}` as any}
            color={themedTextColor}
            style={[styles.title, {}]}
          />
        </TouchableOpacity>
        {dice[die] > 1 &&
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.count}>×</Text>
            <TextInput
              style={[styles.count, { width: 50 }]}
              onBlur={event => setDieAmount(die, event.nativeEvent.text)}
              placeholder={`${dice[die]}`}
              placeholderTextColor={themedTextColor} />
          </View>
        }
      </View>
    </View>
  }));

  return (
    <View style={styles.diceRollerContainer}>
      <Text>Tap dice to add to your roll:</Text>
      <View style={styles.buttonRow}>
        {addDieButtons}
      </View>
      {dieTypeCount > 0 &&
        <View>
          <TextInput
            style={[
              styles.codeHighlightContainer,
              styles.homeScreenFilename,
              { backgroundColor: inputBackgroundColor, fontFamily: 'space-mono' }]}
            value={diceListString} />
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              flexWrap: 'wrap'
            }}>
            {diceInTrayButtons}
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Button title="Roll!" onPress={() => rollDice()} />
            <Button title="Clear!" onPress={() => clear()} color="red" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{totalResult > 0 && `Result: ${totalResult}`}</Text>
            <Text>{resultsList.join(', ')}</Text>
            <Text style={styles.title}></Text>
          </View>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    padding: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  developmentModeText: {
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  diceRollerContainer: {
    flex: 1,
    width: '95%'
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});
