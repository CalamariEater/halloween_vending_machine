import os

class Config(object):
    SECERET_KEY = os.environ.get('SECRET_KEY') or 'VEND_ME_DADDY'