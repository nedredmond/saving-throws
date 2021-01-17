import React, { useEffect, useState } from 'react';
import { Button, StyleSheet } from 'react-native';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RollBuilder() {
  const [dice, setDice] = useState<{ [key: string]: number }>({});
  const [diceListString, setString] = useState('');
  const [totalResult, setTotalResult] = useState(0);
  const [resultsList, setResultsList] = useState<string[]>([]);
  const [dieTypeCount, setDieTypeCount] = useState(0);
  const dieTypes = ["4", "6", "8", "10", "12", "20"]

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
      <MaterialCommunityIcons.Button
        name={`dice-d${die}` as any}
        onPress={() => addDieToRoll(die)}
      >+</MaterialCommunityIcons.Button>
    </View>
  );

  const diceInTrayButtons = Object.keys(dice).map((die =>
    <View key={die} style={{ margin: 10, backgroundColor: '#656565' }}>
      <MaterialCommunityIcons.Button
        name={`dice-d${die}` as any}
        onPress={() => removeDieFromRoll(die)}
      >{dice[die].toString()}</MaterialCommunityIcons.Button>
    </View>
  ));

  return (
    <View style={styles.diceRollerContainer}>
      <View style={styles.buttonRow}>
        {addDieButtons}
      </View>
      <View
        style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
        darkColor="rgba(255,255,255,0.05)"
        lightColor="rgba(0,0,0,0.05)">
        <Text style={styles.title}>Your Heckin' Roll:</Text>
        <MonoText>{diceListString}</MonoText>
      </View>
      <View
        style={{
          flex: 1, backgroundColor: '#656565', borderRadius: 4,
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}>
        {diceInTrayButtons}
      </View>
      <Button title="Roll!" onPress={() => rollDice()} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{totalResult > 0 && `Result: ${totalResult}`}</Text>
        <Text>{resultsList.join(', ')}</Text>
        <Text style={styles.title}></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    maxWidth: '80%'
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
