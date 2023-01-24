import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, SafeAreaView, KeyboardAvoidingView, StyleSheet, AppState, Platform } from 'react-native';
import Card from './src/components/Card';
import mockedData from './src/constants/MockedData';

interface Task {
  id: number,
  title: string,
  description: string,
  state: string
}

const MainScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockedData);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const descriptionInputRef = useRef<TextInput>(null);
  const [appState, setAppState] = useState<string>(AppState.currentState);


  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        setTasks(mockedData);
      }
      setAppState(nextAppState);
    }
    AppState.addEventListener('change', handleAppStateChange);
    // return () => AppState.removeEventListener('change', handleAppStateChange);
  }, []);

  const handleAddTask = () => {
    const newTask = {
      id: tasks.length + 1,
      title,
      description,
      state: "No Realizado",
    };
    setTasks([...tasks, newTask]);
    setTitle('');
    setDescription('');
  }


  const handleTaskStateChange = (id: number) => {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          state: task.state === "No Realizado" ? "Realizado" : "No Realizado"
        }
      }
      return task;
    });
    setTasks(newTasks);
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <FlatList
        data={tasks}
        ListEmptyComponent={<Text>La lista está vacía (⊙_⊙;)</Text>}
        renderItem={({ item }) => <Card title={item.title} description={item.description} state={item.state} onPress={() => handleTaskStateChange(item.id)} />}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled
      />
      <KeyboardAvoidingView>
        <View style={styles.card}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Título"
            returnKeyType="next"
            onSubmitEditing={() => { descriptionInputRef.current?.focus() }}
            style={styles.input}
          />
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Descripción"
            placeholderTextColor={Platform.OS === 'ios' ? 'black' : 'white'}
            returnKeyType="done"
            ref={descriptionInputRef}
            onSubmitEditing={() => { handleAddTask() }}
            style={styles.input}
          />
          <Button
            title="Agregar Tarea"
            onPress={handleAddTask}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? 'lightgray' : '#333',
  },

  card: {
    padding: 5,
    margin: 10,
    borderWidth: 1,
    backgroundColor: Platform.OS === 'ios' ? 'white' : 'black',
    borderRadius: 10
  },

  input: {
    padding: 10,
    margin: 10,
    color: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  }
})

export default MainScreen;
