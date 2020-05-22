import React, {useState,useEffect, useReducer, useCallback} from 'react';
import {ScrollView, View, Text, KeyboardAvoidingView, StyleSheet, Button, ActivityIndicator, Alert, Platform} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Input from '../components/input';
import Card from '../components/Card';
import Colors from '../constants/Colors';
import {useDispatch} from 'react-redux';
import * as authActions from '../store/actions/auth';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidites = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidites) {
            updatedFormIsValid = updatedFormIsValid && updatedValidites[key];
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValues: updatedValues,
            inputValidities: updatedValidites
        };
    }
    return state;
};

const AuthScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        }, 
        inputValidities: {
            email: false,
            password: false
        }, 
        formIsValid: false
    });

    useEffect(() => {
        if (error) {
            Alert.alert('An error Occurred', error, [{text: 'okay'}])
        }
    }, [error]);

    const authHandler = async () => {
        let action;
        if (isSignUp) {
            action = 
            authActions.signup(
                formState.inputValues.email, 
                formState.inputValues.password
                )
        } else {
            action = 
            authActions.login(
                formState.inputValues.email, 
                formState.inputValues.password
                )
        }
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(action);
            //props.navigation.navigate('Shop');
        }
        catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const guestHandler = async () => {
        const action = authActions.guest();
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(action);
        }
        catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue, 
            isValid: inputValidity,
            input: inputIdentifier
        });
    }, [dispatchFormState]);

    return (
    <KeyboardAvoidingView 
    behavior="padding"
    keyboardVerticalOffset={Platform.OS === 'android' ? -300 : 50}
    style={styles.screen}>
    <LinearGradient colors={['#ffedff','grey']} style={styles.gradient}>
       <Card style={styles.authContainer}>
           <ScrollView keyboardDismissMode="none">
                <Input 
                id="email" 
                label="E-Mail" 
                keyboardType="email-address" 
                required 
                email
                autoCapitalize="none"
                errorText="Please enter a valid email"
                onInputChange={inputChangeHandler}
                initialValue=""/>
                <Input 
                id="password" 
                label="password" 
                keyboardType="default" 
                secureTextEntry
                required 
                minLength={5}
                errorText="Please enter a valid password"
                onInputChange={inputChangeHandler}
                initialValue=""/>
           <View style={styles.buttonContainer}>
           { isLoading ? 
           <ActivityIndicator 
           size="small"
           color={Colors.primary}
           />
           : 
           <Button 
           title={isSignUp ? "Sign up" : "Login"} 
           color={Colors.primary} 
           onPress={authHandler}/>
            }
           </View>
           <View style={styles.buttonContainer}>
           <Button 
           title={`Switch to ${isSignUp ? 'Login' : 'Sign up'}`}
           color={Colors.accent} 
           onPress={() => {
               setIsSignUp(prevState => !prevState);
           }}/>
           </View>
           <View style={styles.buttonContainer}>
           <Button 
           title={"continue as guest"}
           color={Colors.primary} 
           onPress={guestHandler}/>
           </View>
           </ScrollView>

       </Card>
    </LinearGradient>
    </KeyboardAvoidingView>
    );
};

export const screenOptions = {
    headerTitle: "Authenticate",
    headerStyle: {
        backgroundColor: '#ffedff',
        shadowColor: 'transparent',
    },
};

const styles = StyleSheet.create({
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20,
    },
    screen: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        marginTop: 10,
    },
});

export default AuthScreen;