import json
import os

CONFIG_FILENAME = 'pbstracker_config.json'


def get_config():

    home_dir = os.path.expanduser('~')

    path_to_configfile = os.path.join(home_dir, CONFIG_FILENAME)

    with open(path_to_configfile) as configfile:
        config = json.load(configfile)

    return config
