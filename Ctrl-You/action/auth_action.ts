'use server';
import { auth,db } from "@/firebase/admin";
import e from "express";
import { CollectionReference, DocumentReference } from "firebase-admin/firestore";
import { doc, getDoc, setDoc} from "firebase/firestore";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7 ;//7 days


export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;
    try {
        const userDocRef = db.collection("users").doc(uid);
        const userRecord = await userDocRef.get();

        if (userRecord.exists) {
            return {
                success: false,
                message: 'User already exists. Please sign in instead.'
            }
        }

        await userDocRef.set({ name, email });

        return {
            success: true,
            message: 'Account created successfully!'
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (e: any) {
        console.error("Error creating a user", e);

        if (e.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: "This email is already in use."
            }
        }
        return {
            success: false,
            message: 'Failed to create an account'
        }
    }
    }

    export async function signIn(params: SignInParams ){
        const{email, idToken} = params;

        try{
            const userRecord = await auth.getUserByEmail(email);
            if(!userRecord){
                return{
                    success: false,
                    message: 'User does not exist. create an account instead.'
                }
            }
            await setSessionCookie(idToken);
            
            return {
                success: true,
                message: 'Logged in successfully!'
            };
            
        }catch(e){
            console.error(e);
            return{
                success: false,
                message: 'Failed to log into an account.'
            }
        }
    }

    export async function setSessionCookie(idToken: string){
        const cookieStore = await cookies();
        const SessionCookie = await auth.createSessionCookie(idToken,{
            expiresIn: ONE_WEEK*1000,//7 days
        })

        cookieStore.set('session', SessionCookie, {
            maxAge: ONE_WEEK,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax'
        })


    }
    export async function getCurrentUser(): Promise<User | null>{
        const cookieStore = await cookies();

        const sessionCookie = cookieStore.get('session')?.value;

        if(!sessionCookie) return null;

        try{
            const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

            const userRecord = await db
              
                    .collection('users')
                    .doc(decodedClaims.uid)
                    .get() as FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>;

            if(!userRecord.exists)return null;

            return{
                ...userRecord.data(),
                id: userRecord.id,

            }as User
        }catch (e){
            console.log(e)
            return null;
        }
    }
    export async function isAuthenticated(){
        const user = await getCurrentUser();

        return !!user;
    }