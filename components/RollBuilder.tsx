import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet } from 'react-native';
import { MonoText } from './StyledText';
import { Text, TextInput, View } from './Themed';

export default function RollBuilder() {
  const [text, setText] = useState<string>();
  const [result, setResult] = useState('Nothing yet.');
  const [dice, setDice] = useState<{ [key: string]: number }>({});
  const [diceListString, setString] = useState('');
  const regex = /^(\d*)d(\d+|\%)(([\+\-\/\*bw])(\d+))?(([\+\-\/\*])(\d+|(\d*)d(\d+|\%)(([\+\-\/\*bw])(\d+))?))*$/;

  useEffect(() => {
    if (text) {
      // const parsedResult = parseDiceNotation(text)
    }
    if (Object.keys(dice).length) {
      let tempString = '';
      for (let die in dice) {
        console.log(die);
        tempString += die.repeat(dice[die]);
      }
      setString(tempString);
    }
  })

  function addDieToRoll(sides: string) {
    let diceList = { ...dice };
    diceList[sides] = diceList[sides] ? ++diceList[sides] : 1;
    setDice(diceList);
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

  return (
    <View>
      <View style={styles.diceRollerContainer}>
        <TextInput
          onChangeText={value => setText(value)}
          value={text}
          placeholder="Enter dice notation (bitch)" />
        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor="rgba(255,255,255,0.05)"
          lightColor="rgba(0,0,0,0.05)">
          <Button
            title="20"
            onPress={() => addDieToRoll("20")}
          />
          <Button
            title="6"
            onPress={() => addDieToRoll("6")}
          />
          <Text style={styles.title}>Your Roll, Bitch:</Text>
          <MonoText>{diceListString}</MonoText>
        </View>
      </View>
    </View>
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
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
    alignItems: 'center',
    marginHorizontal: 50,
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
