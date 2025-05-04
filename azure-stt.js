// Author: greatyan@gmail.com

import { getRequestHeaders } from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';
export { AzureSttProvider };

const DEBUG_PREFIX = '<Speech Recognition module (Azure)> ';

class AzureSttProvider {
    //########//
    // Config //
    //########//

    settings = {
        region: '',
        language: '',
    };

    defaultSettings = {
        region: 'westus',
        language: 'en-US',
    };

    processTranscriptFunction = null;

    get settingsHtml() {
        let html = ' \
        <span>Use the API setting in Azure TTS</span> \
        <span>Language</span></br> \
        <select id="speech_recognition_azure_language"> \
            <option value="en-US">en-US: English (United States)</option> \
            <option value="zh-CN">zh-CN: Chinese (China)</option> \
        </select> \
        ';
        return html;
    }

    onSettingsChange() {
        // Used when provider settings are updated from UI
        this.settings.language = $('#speech_recognition_azure_language').val();
        this.settings.region = extension_settings.tts.Azure.region;
        this.loadSettings(this.settings);
    }

    loadSettings(settings) {
        // Initialise as defaultSettings
        this.settings = this.defaultSettings;
        for (const key in settings) {
            if (key in this.settings) {
                this.settings[key] = settings[key];
            } else {
                throw `Invalid setting passed to Speech recogniton extension (Azure): ${key}`;
            }
        }
        $('#speech_recognition_azure_language').val(this.settings.language);
    }

    async processAudio(audioblob) {
        let requestData = new FormData();
        requestData.append('audioFile', audioblob, 'record.wav');
        requestData.append('lang', this.settings.language);
        requestData.append('region', this.settings.region);

        let headers = getRequestHeaders();
        delete headers['Content-Type'];
        const apiResult = await fetch('/api/azure/recognize', {
            method: 'POST',
            headers: headers,
            body: requestData,
        });

        if (!apiResult.ok) {
            toastr.error(apiResult.statusText, 'STT Generation Failed (Azure)', { timeOut: 10000, extendedTimeOut: 20000, preventDuplicates: true });
            throw new Error(`HTTP ${apiResult.status}: ${await apiResult.text()}`);
        }
        const result = await apiResult.json();
        return result.DisplayText;
    }
}

