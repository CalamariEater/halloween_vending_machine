from email import message
from glob import glob
import json
from time import time
from app import app
from flask import Flask, render_template, session, jsonify, Response, request

PAYLOAD = 'payload'
ITEM = 'item'
NEW = False
MASTER_NEW = False

@app.route('/')
@app.route('/machine')
def machine():
    #return "Hello, World!"
    return render_template('machine.html')

@app.route('/master')
def master():
    return render_template('master.html')

# Save item to session to retrive!


@app.route('/machine/send', methods=['POST'])
def machineSend():
    global MASTER_NEW
    if request.method == 'POST':
        item = request.json
        sesh = session.get(ITEM, None)
        print(item)
        if sesh is not None:
            # Do something
            print('sesh exists already')
        else:
            print('creating sesh')
            session[ITEM] = ''
            #sesh = session.get(PAYLOAD)
        session[ITEM] = item
        session.modified = True
        MASTER_NEW = True
        response = jsonify(success=True)
    else: 
        print("ERROR NOT A POSTO ROOONY") #TODO proper error
        response = jsonify(success=False)
    return response

@app.route('/machine/receive', methods=['GET'])
def machineReceive():
    global NEW
    if request.method == 'GET':
        if NEW is True:
            msg = session.get(PAYLOAD, None)
            if msg is None:
                # Do something
                print('creating sesh')
                #session[PAYLOAD] = ''
                session[PAYLOAD] = {
                    "message": '',
                    "TTS": False
                }
                msg = session.get(PAYLOAD)
            response = msg
            NEW = False
            response = json.dumps(msg)
            return Response(response, status=200)
        return Response(None, status=200) # no change
    else:
        print("ERROR NOT A POSTO ROOONY") #TODO proper error
        response = jsonify(success=False)
    return response

@app.route('/master/receive', methods=['GET'])
def masterReceive():
    global MASTER_NEW
    if request.method == 'GET':
        if MASTER_NEW is True:
            msg = session.get(ITEM, None)
            if msg is None:
                # Do something
                print('creating sesh')
                session[ITEM] = ''
                msg = session.get(ITEM)
            response = msg
            MASTER_NEW = False
            #print(response)
            return Response(response, status=200)
        return Response(None, status=200) # no change
    else:
        print("ERROR NOT A POSTO ROOONY") #TODO proper error
        response = jsonify(success=False)
    return response

@app.route('/master/send', methods=['POST'])
def masterSend():
    global NEW
    if request.method == 'POST':
        payload = request.json
        message = payload["message"]
        tts = payload["TTS"]
        time = payload["time"]
        sesh = session.get(PAYLOAD, None)
        print(payload)
        if sesh is not None:
            # Do something
            print('sesh exists already')
        else:
            print('creating sesh')
            #session[PAYLOAD] = ''
            session[PAYLOAD] = {
                "message": '',
                "TTS": False,
                "time": None
            }
            #sesh = session.get(PAYLOAD)
        #session[PAYLOAD] = item
        session[PAYLOAD] = {
            "message": message,
            "TTS": tts,
            "time": time
        }
        session.modified = True
        NEW = True
        response = jsonify(success=True)
    else: 
        print("ERROR NOT A POSTO ROOONY") #TODO proper error
        response = jsonify(success=False)
    return response

