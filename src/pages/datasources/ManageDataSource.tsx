import {
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonList,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSpinner,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonToast,
} from '@ionic/react';
import {
    information,
    trophy
} from 'ionicons/icons';
import React, {useEffect, useState} from 'react';
import '../../services/actions/security';
import {RouteComponentProps} from "react-router";
import {ThunkDispatch} from "redux-thunk";
import * as Validator from '../../services/utils/validators';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../services/reducers";
import {DataSourcesResult, fetchDataSourcesAction, fetchDataSourcesActions} from "../../services/actions/datasources";
import {DataSource, ModbusDataSource, MQTTDataSource} from "../../types/types";
import {DataSourceResult, fetchDataSourceAction, fetchDataSourceActions} from "../../services/actions/datasource";
import {BuildForm, FieldDescriptionType, FormDescription} from "../../services/utils/form-builder";
import {
    addModbusDataSource,
    addMQTTDataSource,
    updateModbusDataSource,
    updateMQTTDataSource
} from "../../services/rest/datasources";
import {executeDelayed} from "../../services/utils/async-helpers";


let basefields : Array<FieldDescriptionType<DataSource>> = [
    {
        name: 'name', label: 'Data Source Name', type: 'text', position: 'floating',
        color: 'primary', validators: [Validator.required, Validator.minLength(4)]
    }
] ;

let mqttfields : Array<FieldDescriptionType<MQTTDataSource>> = [
    {
        name: 'host', label: 'Host Name', type: 'text', position: 'floating',
        color: 'primary', validators: [Validator.required, Validator.minLength(4)]
    }
    ,
    {
        name: 'port', label: 'Port', type: 'number', position: 'floating',
        color: 'primary', validators: [Validator.required, Validator.minValue(1)]
    }
] ;


let modbusfields : Array<FieldDescriptionType<ModbusDataSource>> = [
    {
        name: 'host', label: 'Host Name', type: 'text', position: 'floating',
        color: 'primary', validators: [Validator.required, Validator.minLength(4)]
    }
    ,
    {
        name: 'port', label: 'Port', type: 'number', position: 'floating',
        color: 'primary', validators: [Validator.required, Validator.minValue(1)]
    }
    ,
    {
        name: 'slaveID', label: 'Slave ID', type: 'number', position: 'floating',
        color: 'primary', validators: [Validator.required, Validator.minValue(1)]
    }
] ;

export default (mode: 'add' | 'edit' ):  React.FC<RouteComponentProps<{id: string, source: string}>> => ({history, match}) => {

    const { dataSource, dataSourceAsModbus, dataSourceAsMqtt, dataSourceType, isLoading, errorMessage } = useSelector((s:RootState) => s.datasource);
    const token = useSelector((s:RootState) => s.user.authentication!.token || '');
    const dispatch = useDispatch();

    const thunkDispatch: ThunkDispatch<RootState, null, DataSourceResult> = useDispatch();

    let allmodbusfield : Array<FieldDescriptionType<ModbusDataSource>> = modbusfields.concat(basefields);
    let allmqttfield : Array<FieldDescriptionType<MQTTDataSource>> = mqttfields.concat(basefields);

    let mqttform = (mode: string): FormDescription<MQTTDataSource> => ({
        name: `mqttform_${mode}`,
        fields: allmqttfield,
        submitLabel: mode === 'add' ? 'Save' : 'Update',
        debug: false
    })

    let modbusform = (mode: string): FormDescription<ModbusDataSource> => ({
        name: `modbusform_${mode}`,
       fields: allmodbusfield,
        submitLabel: mode === 'add' ? 'Save' : 'Update',
        debug: false
    })

    let {Form, loading, error} = BuildForm(dataSourceType === "MQTTDataSource" ? mqttform(mode) : modbusform(mode))
    console.log(dataSource);
    useEffect(() => {
       if(!dataSource || dataSource.name != match.params.source)
       {
           dispatch(fetchDataSourceAction(match.params.source));
           //Datenpunkte Laden
       }
    }, []);

    const MQTTFormInfo= () => {

        let { Form, loading, error } = BuildForm<MQTTDataSource>(mqttform(mode));
        if(!isLoading) {
            if(mode === 'edit' && dataSource) {
                return <Form handleSubmit={submitMqtt} initialState={dataSourceAsMqtt!}/>
            }
            else
            {
                return <Form handleSubmit={submitMqtt} />
            }
        }
        else
        {
            console.log("Empty");
            return <></>
        }
    };

    const ModbusFormInfo= () => {

        let { Form, loading, error } = BuildForm<ModbusDataSource>(modbusform(mode));
        if(!isLoading) {
            if(mode === 'edit' && dataSource) {
                return <Form handleSubmit={submitModbus} initialState={dataSourceAsModbus!}/>
            }
            else
            {
                return <Form handleSubmit={submitModbus} />
            }
        }
        else
        {
            console.log("Empty");
            return <></>
        }
    };

    const submitMqtt = (mqtt: MQTTDataSource) => {
        dispatch(loading(true));
        (mode == 'add' ? addMQTTDataSource(token, mqtt) : updateMQTTDataSource(token, mqtt))
            .then(source => dispatch(fetchDataSourceActions.success(source)))
            .then(request => thunkDispatch(fetchDataSourcesAction())
                .then(request => executeDelayed(100, () => history.goBack())))
            .catch(err => dispatch(error(err))).finally(() => dispatch(loading(false)))

    }

    const submitModbus = (mqtt: ModbusDataSource) => {
        dispatch(loading(true));
        (mode == 'add' ? addModbusDataSource(token, mqtt) : updateModbusDataSource(token, mqtt))
            .then(source => dispatch(fetchDataSourceActions.success(source)))
            .then(request => thunkDispatch(fetchDataSourcesAction())
                .then(request => executeDelayed(100, () => history.goBack())))
            .catch(err => dispatch(error(err))).finally(() => dispatch(loading(false)))

    }


    /*

    const ListDatasourceValues = () => {

        const items = dataSources?.map(value => {
            let icon = trophy;
            const text = value.name!;
            let detailledinfo = "";
            if(value.type == "MQTTDataSource")
            {
                const mqttobj = value as MQTTDataSource;
                detailledinfo = "Host: " + mqttobj.host + " - Port: " + mqttobj.port;
            }
            else
            {
                const modobj = value as ModbusDataSource;
                detailledinfo = "Host: " + modobj.host + " - Port: " + modobj.port  + " Slave ID: " + modobj.slaveID;
            }
            //console.log(typeof value);

            return (
                <IonItemSliding key={text}>
                    <IonItemOptions side="end">
                        <IonItemOption onClick={() => { console.log(text) }}><IonIcon icon={information} /> Details</IonItemOption>
                    </IonItemOptions>
                    <IonItem key={text} onClick={() => history.push('/datapoint/' +text)}>
                        <IonIcon icon={icon} />
                        {text}
                        <div className="item-note" slot="end">
                            {detailledinfo}
                        </div>
                    </IonItem>
                </IonItemSliding>
            );
        });
        if(items && items.length > 0)
        {
            return (<IonList>{items}</IonList>);
        }
        else
        {
            return <NoValuesInfo />
        }
        //    return items.length > 0 ? <IonList>{items}</IonList> : <NoValuesInfo />;
    };

    */



    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>{mode == 'add' ? 'New' : 'Edit'} Datasource {dataSource ? dataSource.name : ""}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                {isLoading ? <IonItem><IonSpinner />Loading Data Sources...</IonItem> :
                dataSourceType === "MQTTDataSource" ? <MQTTFormInfo/> : <ModbusFormInfo/>
                }
                <IonToast
                    isOpen={errorMessage ? errorMessage.length > 0 : false}
                    onDidDismiss={() => false}
                    message={errorMessage}
                    duration={5000}
                    color='danger'
                />

            </IonContent>
        </IonPage>
    );
};

