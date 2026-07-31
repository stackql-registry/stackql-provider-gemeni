---
title: tokens
hide_title: false
hide_table_of_contents: false
keywords:
  - tokens
  - auth_tokens
  - gemini
  - infrastructure-as-code
  - configuration-as-data
  - cloud inventory
description: Query, deploy and manage gemini resources using SQL
custom_edit_url: null
image: /img/stackql-gemini-provider-featured-image.png
---

import CopyableCode from '@site/src/components/CopyableCode/CopyableCode';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SchemaTable from '@site/src/components/SchemaTable/SchemaTable';

Creates, updates, deletes, gets or lists a <code>tokens</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="tokens" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gemini.auth_tokens.tokens" /></td></tr>
</tbody></table>

## Fields

The following fields are returned by `SELECT` queries:

`SELECT` not supported for this resource, use `SHOW METHODS` to view available operations for the resource.


## Methods

The following methods are available for this resource:

<table>
<thead>
    <tr>
    <th>Name</th>
    <th>Accessible by</th>
    <th>Required Params</th>
    <th>Optional Params</th>
    <th>Description</th>
    </tr>
</thead>
<tbody>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td></td>
    <td></td>
    <td>Creates a token that can be used to constrain the behavior of a BidiGenerateContent session.</td>
</tr>
</tbody>
</table>

## Parameters

This resource's methods take no path, query, or request-body parameters; authentication and API-version headers are handled automatically.


## `INSERT` examples

<Tabs
    defaultValue="create"
    values={[
        { label: 'create', value: 'create' },
        { label: 'Manifest', value: 'manifest' }
    ]}
>
<TabItem value="create">

Creates a token that can be used to constrain the behavior of a BidiGenerateContent session.

```sql
INSERT INTO gemini.auth_tokens.tokens (
newSessionExpireTime,
uses,
fieldMask,
bidiGenerateContentSetup,
expireTime,
interactionId
)
SELECT 
'{{ newSessionExpireTime }}',
{{ uses }},
'{{ fieldMask }}',
'{{ bidiGenerateContentSetup }}',
'{{ expireTime }}',
'{{ interactionId }}'
RETURNING
name,
bidiGenerateContentSetup,
expireTime,
fieldMask,
interactionId,
newSessionExpireTime,
uses
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: tokens
  props:
    - name: newSessionExpireTime
      value: "{{ newSessionExpireTime }}"
      description: |
        Optional. Input only. Immutable. The time after which new Live API sessions using the token resulting from this request will be rejected. If not set this defaults to 60 seconds in the future. If set, this value must be less than 20 hours in the future.
    - name: uses
      value: {{ uses }}
      description: |
        Optional. Input only. Immutable. The number of times the token can be used. If this value is zero then no limit is applied. Resuming a Live API session does not count as a use. If unspecified, the default is 1.
    - name: fieldMask
      value: "{{ fieldMask }}"
      description: |
        Optional. Input only. Immutable. If field_mask is empty, and \`bidi_generate_content_setup\` is not present, then the effective \`BidiGenerateContentSetup\` message is taken from the Live API connection. If field_mask is empty, and \`bidi_generate_content_setup\` _is_ present, then the effective \`BidiGenerateContentSetup\` message is taken entirely from \`bidi_generate_content_setup\` in this request. The setup message from the Live API connection is ignored. If field_mask is not empty, then the corresponding fields from \`bidi_generate_content_setup\` will overwrite the fields from the setup message in the Live API connection.
    - name: bidiGenerateContentSetup
      description: |
        Optional. Input only. Immutable. Configuration specific to \`BidiGenerateContent\`.
      value:
        inputAudioTranscription:
          customVocabulary:
            - "{{ customVocabulary }}"
          diarization: {{ diarization }}
          languageAuto: "{{ languageAuto }}"
          languageHints:
            languageCodes:
              - "{{ languageCodes }}"
          adaptationPhrases:
            - "{{ adaptationPhrases }}"
          wordTimestamp: {{ wordTimestamp }}
        outputAudioTranscription:
          customVocabulary:
            - "{{ customVocabulary }}"
          diarization: {{ diarization }}
          languageAuto: "{{ languageAuto }}"
          languageHints:
            languageCodes:
              - "{{ languageCodes }}"
          adaptationPhrases:
            - "{{ adaptationPhrases }}"
          wordTimestamp: {{ wordTimestamp }}
        model: "{{ model }}"
        systemInstruction:
          parts:
            - codeExecutionResult:
                outcome: "{{ outcome }}"
                output: "{{ output }}"
                id: "{{ id }}"
              videoMetadata:
                startOffset: "{{ startOffset }}"
                endOffset: "{{ endOffset }}"
                fps: {{ fps }}
              partMetadata: "{{ partMetadata }}"
              inlineData:
                mimeType: "{{ mimeType }}"
                data: "{{ data }}"
              functionResponse:
                willContinue: {{ willContinue }}
                response: "{{ response }}"
                parts:
                  - inlineData:
                      mimeType: "{{ mimeType }}"
                      data: "{{ data }}"
                id: "{{ id }}"
                scheduling: "{{ scheduling }}"
                name: "{{ name }}"
              executableCode:
                id: "{{ id }}"
                code: "{{ code }}"
                language: "{{ language }}"
              text: "{{ text }}"
              functionCall:
                name: "{{ name }}"
                args: "{{ args }}"
                id: "{{ id }}"
              toolCall:
                args: "{{ args }}"
                id: "{{ id }}"
                toolType: "{{ toolType }}"
              toolResponse:
                toolType: "{{ toolType }}"
                response: "{{ response }}"
                id: "{{ id }}"
              thought: {{ thought }}
              mediaResolution:
                level: "{{ level }}"
              thoughtSignature: "{{ thoughtSignature }}"
              fileData:
                mimeType: "{{ mimeType }}"
                fileUri: "{{ fileUri }}"
          role: "{{ role }}"
        sessionResumption:
          handle: "{{ handle }}"
        tools:
          - codeExecution: "{{ codeExecution }}"
            googleSearch:
              timeRangeFilter:
                endTime: "{{ endTime }}"
                startTime: "{{ startTime }}"
              searchTypes:
                webSearch: "{{ webSearch }}"
                imageSearch: "{{ imageSearch }}"
            googleMaps:
              enableWidget: {{ enableWidget }}
            computerUse:
              excludedPredefinedFunctions:
                - "{{ excludedPredefinedFunctions }}"
              enablePromptInjectionDetection: {{ enablePromptInjectionDetection }}
              environment: "{{ environment }}"
              disabledSafetyPolicies:
                - "{{ disabledSafetyPolicies }}"
            functionDeclarations: "{{ functionDeclarations }}"
            mcpServers: "{{ mcpServers }}"
            urlContext: "{{ urlContext }}"
            googleSearchRetrieval:
              dynamicRetrievalConfig:
                mode: "{{ mode }}"
                dynamicThreshold: {{ dynamicThreshold }}
            fileSearch:
              fileSearchStoreNames:
                - "{{ fileSearchStoreNames }}"
              topK: {{ topK }}
              metadataFilter: "{{ metadataFilter }}"
        generationConfig:
          topK: {{ topK }}
          seed: {{ seed }}
          maxOutputTokens: {{ maxOutputTokens }}
          responseSchema:
            description: "{{ description }}"
            maximum: {{ maximum }}
            default: "{{ default }}"
            maxItems: "{{ maxItems }}"
            properties: "{{ properties }}"
            minProperties: "{{ minProperties }}"
            maxLength: "{{ maxLength }}"
            minItems: "{{ minItems }}"
            pattern: "{{ pattern }}"
            title: "{{ title }}"
            nullable: {{ nullable }}
            maxProperties: "{{ maxProperties }}"
            required:
              - "{{ required }}"
            example: "{{ example }}"
            type: "{{ type }}"
            anyOf:
              - description: "{{ description }}"
                maximum: {{ maximum }}
                default: "{{ default }}"
                maxItems: "{{ maxItems }}"
                properties: "{{ properties }}"
                minProperties: "{{ minProperties }}"
                maxLength: "{{ maxLength }}"
                minItems: "{{ minItems }}"
                pattern: "{{ pattern }}"
                title: "{{ title }}"
                nullable: {{ nullable }}
                maxProperties: "{{ maxProperties }}"
                required: "{{ required }}"
                example: "{{ example }}"
                type: "{{ type }}"
                anyOf: "{{ anyOf }}"
                minimum: {{ minimum }}
                propertyOrdering: "{{ propertyOrdering }}"
                format: "{{ format }}"
                items:
                  description: "{{ description }}"
                  maximum: {{ maximum }}
                  default: "{{ default }}"
                  maxItems: "{{ maxItems }}"
                  properties: "{{ properties }}"
                  minProperties: "{{ minProperties }}"
                  maxLength: "{{ maxLength }}"
                  minItems: "{{ minItems }}"
                  pattern: "{{ pattern }}"
                  title: "{{ title }}"
                  nullable: {{ nullable }}
                  maxProperties: "{{ maxProperties }}"
                  required: "{{ required }}"
                  example: "{{ example }}"
                  type: "{{ type }}"
                  anyOf: "{{ anyOf }}"
                  minimum: {{ minimum }}
                  propertyOrdering: "{{ propertyOrdering }}"
                  format: "{{ format }}"
                  items: "{{ items }}"
                  minLength: "{{ minLength }}"
                  enum: "{{ enum }}"
                minLength: "{{ minLength }}"
                enum: "{{ enum }}"
            minimum: {{ minimum }}
            propertyOrdering:
              - "{{ propertyOrdering }}"
            format: "{{ format }}"
            items:
              description: "{{ description }}"
              maximum: {{ maximum }}
              default: "{{ default }}"
              maxItems: "{{ maxItems }}"
              properties: "{{ properties }}"
              minProperties: "{{ minProperties }}"
              maxLength: "{{ maxLength }}"
              minItems: "{{ minItems }}"
              pattern: "{{ pattern }}"
              title: "{{ title }}"
              nullable: {{ nullable }}
              maxProperties: "{{ maxProperties }}"
              required:
                - "{{ required }}"
              example: "{{ example }}"
              type: "{{ type }}"
              anyOf:
                - description: "{{ description }}"
                  maximum: {{ maximum }}
                  default: "{{ default }}"
                  maxItems: "{{ maxItems }}"
                  properties: "{{ properties }}"
                  minProperties: "{{ minProperties }}"
                  maxLength: "{{ maxLength }}"
                  minItems: "{{ minItems }}"
                  pattern: "{{ pattern }}"
                  title: "{{ title }}"
                  nullable: {{ nullable }}
                  maxProperties: "{{ maxProperties }}"
                  required: "{{ required }}"
                  example: "{{ example }}"
                  type: "{{ type }}"
                  anyOf: "{{ anyOf }}"
                  minimum: {{ minimum }}
                  propertyOrdering: "{{ propertyOrdering }}"
                  format: "{{ format }}"
                  items:
                    description: "{{ description }}"
                    maximum: {{ maximum }}
                    default: "{{ default }}"
                    maxItems: "{{ maxItems }}"
                    properties: "{{ properties }}"
                    minProperties: "{{ minProperties }}"
                    maxLength: "{{ maxLength }}"
                    minItems: "{{ minItems }}"
                    pattern: "{{ pattern }}"
                    title: "{{ title }}"
                    nullable: {{ nullable }}
                    maxProperties: "{{ maxProperties }}"
                    required: "{{ required }}"
                    example: "{{ example }}"
                    type: "{{ type }}"
                    anyOf: "{{ anyOf }}"
                    minimum: {{ minimum }}
                    propertyOrdering: "{{ propertyOrdering }}"
                    format: "{{ format }}"
                    items: "{{ items }}"
                    minLength: "{{ minLength }}"
                    enum: "{{ enum }}"
                  minLength: "{{ minLength }}"
                  enum: "{{ enum }}"
              minimum: {{ minimum }}
              propertyOrdering:
                - "{{ propertyOrdering }}"
              format: "{{ format }}"
              items:
                description: "{{ description }}"
                maximum: {{ maximum }}
                default: "{{ default }}"
                maxItems: "{{ maxItems }}"
                properties: "{{ properties }}"
                minProperties: "{{ minProperties }}"
                maxLength: "{{ maxLength }}"
                minItems: "{{ minItems }}"
                pattern: "{{ pattern }}"
                title: "{{ title }}"
                nullable: {{ nullable }}
                maxProperties: "{{ maxProperties }}"
                required: "{{ required }}"
                example: "{{ example }}"
                type: "{{ type }}"
                anyOf: "{{ anyOf }}"
                minimum: {{ minimum }}
                propertyOrdering: "{{ propertyOrdering }}"
                format: "{{ format }}"
                items: "{{ items }}"
                minLength: "{{ minLength }}"
                enum: "{{ enum }}"
              minLength: "{{ minLength }}"
              enum:
                - "{{ enum }}"
            minLength: "{{ minLength }}"
            enum:
              - "{{ enum }}"
          enableEnhancedCivicAnswers: {{ enableEnhancedCivicAnswers }}
          frequencyPenalty: {{ frequencyPenalty }}
          stopSequences:
            - "{{ stopSequences }}"
          presencePenalty: {{ presencePenalty }}
          responseLogprobs: {{ responseLogprobs }}
          thinkingConfig:
            thinkingLevel: "{{ thinkingLevel }}"
            thinkingBudget: {{ thinkingBudget }}
            includeThoughts: {{ includeThoughts }}
          logprobs: {{ logprobs }}
          responseMimeType: "{{ responseMimeType }}"
          mediaResolution: "{{ mediaResolution }}"
          responseModalities:
            - "{{ responseModalities }}"
          audioTranscriptionConfig:
            customVocabulary:
              - "{{ customVocabulary }}"
            diarization: {{ diarization }}
            languageAuto: "{{ languageAuto }}"
            languageHints:
              languageCodes:
                - "{{ languageCodes }}"
            adaptationPhrases:
              - "{{ adaptationPhrases }}"
            wordTimestamp: {{ wordTimestamp }}
          topP: {{ topP }}
          _responseJsonSchema: "{{ _responseJsonSchema }}"
          candidateCount: {{ candidateCount }}
          temperature: {{ temperature }}
          enableAffectiveDialog: {{ enableAffectiveDialog }}
          translationConfig:
            echoTargetLanguage: {{ echoTargetLanguage }}
            targetLanguageCode: "{{ targetLanguageCode }}"
          imageConfig:
            aspectRatio: "{{ aspectRatio }}"
            imageSize: "{{ imageSize }}"
          speechConfig:
            multiSpeakerVoiceConfig:
              speakerVoiceConfigs:
                - speaker: "{{ speaker }}"
                  voiceConfig:
                    prebuiltVoiceConfig: "{{ prebuiltVoiceConfig }}"
            languageCode: "{{ languageCode }}"
            voiceConfig:
              prebuiltVoiceConfig:
                voiceName: "{{ voiceName }}"
          responseFormat:
            text:
              mimeType: "{{ mimeType }}"
              schema: "{{ schema }}"
            audio:
              delivery: "{{ delivery }}"
              sampleRate: {{ sampleRate }}
              mimeType: "{{ mimeType }}"
              bitRate: {{ bitRate }}
            image:
              delivery: "{{ delivery }}"
              imageSize: "{{ imageSize }}"
              mimeType: "{{ mimeType }}"
              aspectRatio: "{{ aspectRatio }}"
          responseJsonSchema: "{{ responseJsonSchema }}"
        contextWindowCompression:
          slidingWindow:
            targetTokens: "{{ targetTokens }}"
          triggerTokens: "{{ triggerTokens }}"
        realtimeInputConfig:
          automaticActivityDetection:
            silenceDurationMs: {{ silenceDurationMs }}
            prefixPaddingMs: {{ prefixPaddingMs }}
            endOfSpeechSensitivity: "{{ endOfSpeechSensitivity }}"
            disabled: {{ disabled }}
            startOfSpeechSensitivity: "{{ startOfSpeechSensitivity }}"
          activityHandling: "{{ activityHandling }}"
          turnCoverage: "{{ turnCoverage }}"
        historyConfig:
          initialHistoryInClientContent: {{ initialHistoryInClientContent }}
    - name: expireTime
      value: "{{ expireTime }}"
      description: |
        Optional. Input only. Immutable. An optional time after which, when using the resulting token, messages in BidiGenerateContent sessions will be rejected. (Gemini may preemptively close the session after this time.) If not set then this defaults to 30 minutes in the future. If set, this value must be less than 20 hours in the future.
    - name: interactionId
      value: "{{ interactionId }}"
      description: |
        Optional. Input only. Immutable. The interaction ID that this token is scoped to. Specific to the Live Interactions API.
`}</CodeBlock>

</TabItem>
</Tabs>
