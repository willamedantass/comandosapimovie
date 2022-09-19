import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import path from "path";
import fs from 'fs'

const firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyDBTzjLpwMJB-mEVqSxBEYbdx5ahg8g_WI",
    authDomain: "painelincrivel.firebaseapp.com",
    databaseURL: "https://painelincrivel-default-rtdb.firebaseio.com",
    projectId: "painelincrivel",
    storageBucket: "painelincrivel.appspot.com",
    messagingSenderId: "351326613697",
    appId: "1:351326613697:web:7ba857b4e4e2e279a5e440",
    measurementId: "G-BR78V0612F"
}

const csvWriter = require('csv-writer');
const app = initializeApp(firebaseConfig);
const dbRef = ref(getDatabase(app), 'Agenda');
let linhas: string = "Name,Given Name,Additional Name,Family Name,Yomi Name,Given Name Yomi,Additional Name Yomi,Family Name Yomi,Name Prefix,Name Suffix,Initials,Nickname,Short Name,Maiden Name,Birthday,Gender,Location,Billing Information,Directory Server,Mileage,Occupation,Hobby,Sensitivity,Priority,Subject,Notes,Language,Photo,Group Membership,Phone 1 - Type,Phone 1 - Value\n";

type Contato = {
    "Name": string;
    "Given Name": string;
    "Additional Name": string;
    "Family Name": string;
    "Yomi Name": string;
    "Given Name Yomi": string;
    "Additional Name Yomi": string;
    "Family Name Yomi": string;
    "Name Prefix": string;
    "Name Suffix": string;
    "Initials": string;
    "Nickname": string;
    "Short Name": string;
    "Maiden Name": string;
    "Birthday": string;
    "Gender": string;
    "Location": string;
    "Billing Information": string;
    "Directory Server": string;
    "Mileage": string;
    "Occupation": string;
    "Hobby": string;
    "Sensitivity": string;
    "Priority": string;
    "Subject": string;
    "Notes": string;
    "Language": string;
    "Photo": string;
    "Group Membership": string;
    "Phone 1 - Type": string;
    "Phone 1 - Value": string;
};



const teste = async () => {
    let contatos: Contato[] = [];
    onValue(dbRef, (snapShot) => {
        if (snapShot.exists) {
            let arquivo = 0
            snapShot.forEach(child => {
                const value = child.val()
                const contato: Contato = {
                    "Name": value.nome,
                    "Given Name": "",
                    "Additional Name": "",
                    "Family Name": "",
                    "Yomi Name": "",
                    "Given Name Yomi": "",
                    "Additional Name Yomi": "",
                    "Family Name Yomi": "",
                    "Name Prefix": "",
                    "Name Suffix": "",
                    "Initials": "",
                    "Nickname": "",
                    "Short Name": "",
                    "Maiden Name": "",
                    "Birthday": "",
                    "Gender": "",
                    "Location": "",
                    "Billing Information": "",
                    "Directory Server": "",
                    "Mileage": "",
                    "Occupation": "",
                    "Hobby": "",
                    "Sensitivity": "",
                    "Priority": "",
                    "Subject": "",
                    "Notes": "",
                    "Language": "",
                    "Photo": "",
                    "Group Membership": "",
                    "Phone 1 - Type": "Clientes",
                    "Phone 1 - Value": value.contato
                }
                contatos.push(contato)
                if (contatos.length == 2500) {
                    const writer = csvWriter.createObjectCsvWriter({
                        path: path.resolve(__dirname, '..', 'cache', `contatos${arquivo}.csv`),
                        header: [
                            { id: "Name", title: "Name" },
                            { id: "Given Name", title: "Given Name" },
                            { id: "Additional Name", title: "Additional Name" },
                            { id: "Family Name", title: "Family Name" },
                            { id: "Yomi Name", title: "Yomi Name" },
                            { id: "Given Name Yomi", title: "Given Name Yomi" },
                            { id: "Additional Name Yomi", title: "Additional Name Yomi" },
                            { id: "Family Name Yomi", title: "Family Name Yomi" },
                            { id: "Name Prefix", title: "Name Prefix" },
                            { id: "Name Suffix", title: "Name Suffix" },
                            { id: "Initials", title: "Initials" },
                            { id: "Nickname", title: "Nickname" },
                            { id: "Short Name", title: "Short Name" },
                            { id: "Maiden Name", title: "Maiden Name" },
                            { id: "Birthday", title: "Birthday" },
                            { id: "Gender", title: "Gender" },
                            { id: "Location", title: "Location" },
                            { id: "Billing Information", title: "Billing Information" },
                            { id: "Directory Server", title: "Directory Server" },
                            { id: "Mileage", title: "Mileage" },
                            { id: "Occupation", title: "Occupation" },
                            { id: "Hobby", title: "Hobby" },
                            { id: "Sensitivity", title: "Sensitivity" },
                            { id: "Priority", title: "Priority" },
                            { id: "Subject", title: "Subject" },
                            { id: "Notes", title: "Notes" },
                            { id: "Language", title: "Language" },
                            { id: "Photo", title: "Photo" },
                            { id: "Group Membership", title: "Group Membership" },
                            { id: "Phone 1 - Type", title: "Phone 1 - Type" },
                            { id: "Phone 1 - Value", title: "Phone 1 - Value" }
                        ],
                    });

                    writer.writeRecords(contatos).then(() => {
                        console.log('Done!');
                    });

                    contatos = []
                    arquivo += 1
                }
            });

            const writer = csvWriter.createObjectCsvWriter({
                path: path.resolve(__dirname, '..', 'cache', `contatos${arquivo}.csv`),
                header: [
                    { id: "Name", title: "Name" },
                    { id: "Given Name", title: "Given Name" },
                    { id: "Additional Name", title: "Additional Name" },
                    { id: "Family Name", title: "Family Name" },
                    { id: "Yomi Name", title: "Yomi Name" },
                    { id: "Given Name Yomi", title: "Given Name Yomi" },
                    { id: "Additional Name Yomi", title: "Additional Name Yomi" },
                    { id: "Family Name Yomi", title: "Family Name Yomi" },
                    { id: "Name Prefix", title: "Name Prefix" },
                    { id: "Name Suffix", title: "Name Suffix" },
                    { id: "Initials", title: "Initials" },
                    { id: "Nickname", title: "Nickname" },
                    { id: "Short Name", title: "Short Name" },
                    { id: "Maiden Name", title: "Maiden Name" },
                    { id: "Birthday", title: "Birthday" },
                    { id: "Gender", title: "Gender" },
                    { id: "Location", title: "Location" },
                    { id: "Billing Information", title: "Billing Information" },
                    { id: "Directory Server", title: "Directory Server" },
                    { id: "Mileage", title: "Mileage" },
                    { id: "Occupation", title: "Occupation" },
                    { id: "Hobby", title: "Hobby" },
                    { id: "Sensitivity", title: "Sensitivity" },
                    { id: "Priority", title: "Priority" },
                    { id: "Subject", title: "Subject" },
                    { id: "Notes", title: "Notes" },
                    { id: "Language", title: "Language" },
                    { id: "Photo", title: "Photo" },
                    { id: "Group Membership", title: "Group Membership" },
                    { id: "Phone 1 - Type", title: "Phone 1 - Type" },
                    { id: "Phone 1 - Value", title: "Phone 1 - Value" }
                ],
            });

            writer.writeRecords(contatos).then(() => {
                console.log('Done!');
            });
        }


    });
}

teste()


