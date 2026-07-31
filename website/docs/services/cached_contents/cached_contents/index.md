---
title: cached_contents
hide_title: false
hide_table_of_contents: false
keywords:
  - cached_contents
  - cached_contents
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

Creates, updates, deletes, gets or lists a <code>cached_contents</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="cached_contents" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gemini.cached_contents.cached_contents" /></td></tr>
</tbody></table>

## Fields

The following fields are returned by `SELECT` queries:

<Tabs
    defaultValue="get"
    values={[
        { label: 'get', value: 'get' },
        { label: 'list', value: 'list' }
    ]}
>
<TabItem value="get">

<SchemaTable fields={[
  {
    "name": "name",
    "type": "string",
    "description": "Output only. Identifier. The resource name referring to the cached content. Format: `cachedContents/&#123;id&#125;`"
  },
  {
    "name": "contents",
    "type": "array",
    "description": "Optional. Input only. Immutable. The content to cache.",
    "children": [
      {
        "name": "parts",
        "type": "array",
        "description": "Ordered `Parts` that constitute a single message. Parts may have different MIME types.",
        "children": [
          {
            "name": "codeExecutionResult",
            "type": "object",
            "description": "Result of executing the `ExecutableCode`.",
            "children": [
              {
                "name": "outcome",
                "type": "string",
                "description": "Required. Outcome of the code execution. (OUTCOME_UNSPECIFIED, OUTCOME_OK, OUTCOME_FAILED, OUTCOME_DEADLINE_EXCEEDED)"
              },
              {
                "name": "output",
                "type": "string",
                "description": "Optional. Contains stdout when code execution is successful, stderr or other description otherwise."
              },
              {
                "name": "id",
                "type": "string",
                "description": "Optional. The identifier of the `ExecutableCode` part this result is for. Only populated if the corresponding `ExecutableCode` has an id."
              }
            ]
          },
          {
            "name": "videoMetadata",
            "type": "object",
            "description": "Optional. Video metadata. The metadata should only be specified while the video data is presented in inline_data or file_data.",
            "children": [
              {
                "name": "startOffset",
                "type": "string (google-duration)",
                "description": "Optional. The start offset of the video."
              },
              {
                "name": "endOffset",
                "type": "string (google-duration)",
                "description": "Optional. The end offset of the video."
              },
              {
                "name": "fps",
                "type": "number (double)",
                "description": "Optional. The frame rate of the video sent to the model. If not specified, the default value will be 1.0. The fps range is (0.0, 24.0]."
              }
            ]
          },
          {
            "name": "partMetadata",
            "type": "object",
            "description": "Custom metadata associated with the Part. Agents using genai.Part as content representation may need to keep track of the additional information. For example it can be name of a file/source from which the Part originates or a way to multiplex multiple Part streams."
          },
          {
            "name": "inlineData",
            "type": "object",
            "description": "Inline media bytes.",
            "children": [
              {
                "name": "mimeType",
                "type": "string",
                "description": "The IANA standard MIME type of the source data. Examples of supported types: - Images: image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, image/gif, image/avif - Audio: audio/*, video/audio/s16le, video/audio/wav - Video: video/* - Text: text/plain, text/html, text/css, text/javascript, text/x-typescript, text/csv, text/markdown, text/x-python, text/xml, text/rtf, video/text/timestamp - Applications: application/x-javascript, application/x-typescript, application/x-python-code, application/json, application/x-ipynb+json, application/rtf, application/pdf For additional context, see [Supported file formats](https://ai.google.dev/gemini-api/docs/file-input-methods#supported-content-types). //"
              },
              {
                "name": "data",
                "type": "string (byte)",
                "description": "Raw bytes for media formats."
              }
            ]
          },
          {
            "name": "functionResponse",
            "type": "object",
            "description": "The result output of a `FunctionCall` that contains a string representing the `FunctionDeclaration.name` and a structured JSON object containing any output from the function is used as context to the model.",
            "children": [
              {
                "name": "willContinue",
                "type": "boolean",
                "description": "Optional. Signals that function call continues, and more responses will be returned, turning the function call into a generator. Is only applicable to NON_BLOCKING function calls, is ignored otherwise. If set to false, future responses will not be considered. It is allowed to return empty `response` with `will_continue=False` to signal that the function call is finished. This may still trigger the model generation. To avoid triggering the generation and finish the function call, additionally set `scheduling` to `SILENT`."
              },
              {
                "name": "response",
                "type": "object",
                "description": "Required. The function response in JSON object format. Callers can use any keys of their choice that fit the function's syntax to return the function output, e.g. \"output\", \"result\", etc. In particular, if the function call failed to execute, the response can have an \"error\" key to return error details to the model. Multimedia can be included by using a subobject containing a single \"$ref\" key whose value is the `inline_data.display_name` of a `FunctionResponsePart` holding the multimedia. See https://ai.google.dev/gemini-api/docs/function-calling#multimodal."
              },
              {
                "name": "parts",
                "type": "array",
                "description": "Optional. Ordered `Parts` that constitute a function response. Parts may have different IANA MIME types."
              },
              {
                "name": "id",
                "type": "string",
                "description": "Optional. The identifier of the function call this response is for. Populated by the client to match the corresponding function call `id`."
              },
              {
                "name": "scheduling",
                "type": "string",
                "description": "Optional. Specifies how the response should be scheduled in the conversation. Only applicable to NON_BLOCKING function calls, is ignored otherwise. Defaults to WHEN_IDLE. (SCHEDULING_UNSPECIFIED, SILENT, WHEN_IDLE, INTERRUPT)"
              },
              {
                "name": "name",
                "type": "string",
                "description": "Required. The name of the function to call. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 128."
              }
            ]
          },
          {
            "name": "executableCode",
            "type": "object",
            "description": "Code generated by the model that is meant to be executed.",
            "children": [
              {
                "name": "id",
                "type": "string",
                "description": "Optional. Unique identifier of the `ExecutableCode` part. The server returns the `CodeExecutionResult` with the matching `id`."
              },
              {
                "name": "code",
                "type": "string",
                "description": "Required. The code to be executed."
              },
              {
                "name": "language",
                "type": "string",
                "description": "Required. Programming language of the `code`. (LANGUAGE_UNSPECIFIED, PYTHON)"
              }
            ]
          },
          {
            "name": "text",
            "type": "string",
            "description": "Inline text."
          },
          {
            "name": "functionCall",
            "type": "object",
            "description": "A predicted `FunctionCall` returned from the model that contains a string representing the `FunctionDeclaration.name` with the arguments and their values.",
            "children": [
              {
                "name": "name",
                "type": "string",
                "description": "Required. The name of the function to call. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 128."
              },
              {
                "name": "args",
                "type": "object",
                "description": "Optional. The function parameters and values in JSON object format."
              },
              {
                "name": "id",
                "type": "string",
                "description": "Optional. Unique identifier of the function call. If populated, the client to execute the `function_call` and return the response with the matching `id`."
              }
            ]
          },
          {
            "name": "toolCall",
            "type": "object",
            "description": "Server-side tool call. This field is populated when the model predicts a tool invocation that should be executed on the server. The client is expected to echo this message back to the API.",
            "children": [
              {
                "name": "args",
                "type": "object",
                "description": "Optional. The tool call arguments. Example: &#123;\"arg1\" : \"value1\", \"arg2\" : \"value2\" , ...&#125;"
              },
              {
                "name": "id",
                "type": "string",
                "description": "Optional. Unique identifier of the tool call. The server returns the tool response with the matching `id`."
              },
              {
                "name": "toolType",
                "type": "string",
                "description": "Required. The type of tool that was called. (TOOL_TYPE_UNSPECIFIED, GOOGLE_SEARCH_WEB, GOOGLE_SEARCH_IMAGE, URL_CONTEXT, GOOGLE_MAPS, FILE_SEARCH)"
              }
            ]
          },
          {
            "name": "toolResponse",
            "type": "object",
            "description": "The output from a server-side `ToolCall` execution. This field is populated by the client with the results of executing the corresponding `ToolCall`.",
            "children": [
              {
                "name": "toolType",
                "type": "string",
                "description": "Required. The type of tool that was called, matching the `tool_type` in the corresponding `ToolCall`. (TOOL_TYPE_UNSPECIFIED, GOOGLE_SEARCH_WEB, GOOGLE_SEARCH_IMAGE, URL_CONTEXT, GOOGLE_MAPS, FILE_SEARCH)"
              },
              {
                "name": "response",
                "type": "object",
                "description": "Optional. The tool response."
              },
              {
                "name": "id",
                "type": "string",
                "description": "Optional. The identifier of the tool call this response is for."
              }
            ]
          },
          {
            "name": "thought",
            "type": "boolean",
            "description": "Optional. Indicates if the part is thought from the model."
          },
          {
            "name": "mediaResolution",
            "type": "object",
            "description": "Optional. Media resolution for the input media.",
            "children": [
              {
                "name": "level",
                "type": "string",
                "description": "The tokenization quality used for given media. for Gemini API support . (MEDIA_RESOLUTION_UNSPECIFIED, MEDIA_RESOLUTION_LOW, MEDIA_RESOLUTION_MEDIUM, MEDIA_RESOLUTION_HIGH, MEDIA_RESOLUTION_ULTRA_HIGH)"
              }
            ]
          },
          {
            "name": "thoughtSignature",
            "type": "string (byte)",
            "description": "Optional. An opaque signature for the thought so it can be reused in subsequent requests."
          },
          {
            "name": "fileData",
            "type": "object",
            "description": "URI based data.",
            "children": [
              {
                "name": "mimeType",
                "type": "string",
                "description": "Optional. The IANA standard MIME type of the source data."
              },
              {
                "name": "fileUri",
                "type": "string",
                "description": "Required. URI."
              }
            ]
          }
        ]
      },
      {
        "name": "role",
        "type": "string",
        "description": "Optional. The producer of the content. Must be either 'user' or 'model'. Useful to set for multi-turn conversations, otherwise can be left blank or unset."
      }
    ]
  },
  {
    "name": "createTime",
    "type": "string (google-datetime)",
    "description": "Output only. Creation time of the cache entry."
  },
  {
    "name": "displayName",
    "type": "string",
    "description": "Optional. Immutable. The user-generated meaningful display name of the cached content. Maximum 128 Unicode characters."
  },
  {
    "name": "expireTime",
    "type": "string (google-datetime)",
    "description": "Timestamp in UTC of when this resource is considered expired. This is *always* provided on output, regardless of what was sent on input."
  },
  {
    "name": "model",
    "type": "string",
    "description": "Required. Immutable. The name of the `Model` to use for cached content Format: `models/&#123;model&#125;`"
  },
  {
    "name": "systemInstruction",
    "type": "object",
    "description": "The base structured datatype containing multi-part content of a message. A `Content` includes a `role` field designating the producer of the `Content` and a `parts` field containing multi-part data that contains the content of the message turn.",
    "children": [
      {
        "name": "parts",
        "type": "array",
        "description": "Ordered `Parts` that constitute a single message. Parts may have different MIME types.",
        "children": [
          {
            "name": "codeExecutionResult",
            "type": "object",
            "description": "Result of executing the `ExecutableCode`.",
            "children": [
              {
                "name": "outcome",
                "type": "string",
                "description": "Required. Outcome of the code execution. (OUTCOME_UNSPECIFIED, OUTCOME_OK, OUTCOME_FAILED, OUTCOME_DEADLINE_EXCEEDED)"
              },
              {
                "name": "output",
                "type": "string",
                "description": "Optional. Contains stdout when code execution is successful, stderr or other description otherwise."
              },
              {
                "name": "id",
                "type": "string",
                "description": "Optional. The identifier of the `ExecutableCode` part this result is for. Only populated if the corresponding `ExecutableCode` has an id."
              }
            ]
          },
          {
            "name": "videoMetadata",
            "type": "object",
            "description": "Optional. Video metadata. The metadata should only be specified while the video data is presented in inline_data or file_data.",
            "children": [
              {
                "name": "startOffset",
                "type": "string (google-duration)",
                "description": "Optional. The start offset of the video."
              },
              {
                "name": "endOffset",
                "type": "string (google-duration)",
                "description": "Optional. The end offset of the video."
              },
              {
                "name": "fps",
                "type": "number (double)",
                "description": "Optional. The frame rate of the video sent to the model. If not specified, the default value will be 1.0. The fps range is (0.0, 24.0]."
              }
            ]
          },
          {
            "name": "partMetadata",
            "type": "object",
            "description": "Custom metadata associated with the Part. Agents using genai.Part as content representation may need to keep track of the additional information. For example it can be name of a file/source from which the Part originates or a way to multiplex multiple Part streams."
          },
          {
            "name": "inlineData",
            "type": "object",
            "description": "Inline media bytes.",
            "children": [
              {
                "name": "mimeType",
                "type": "string",
                "description": "The IANA standard MIME type of the source data. Examples of supported types: - Images: image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, image/gif, image/avif - Audio: audio/*, video/audio/s16le, video/audio/wav - Video: video/* - Text: text/plain, text/html, text/css, text/javascript, text/x-typescript, text/csv, text/markdown, text/x-python, text/xml, text/rtf, video/text/timestamp - Applications: application/x-javascript, application/x-typescript, application/x-python-code, application/json, application/x-ipynb+json, application/rtf, application/pdf For additional context, see [Supported file formats](https://ai.google.dev/gemini-api/docs/file-input-methods#supported-content-types). //"
              },
              {
                "name": "data",
                "type": "string (byte)",
                "description": "Raw bytes for media formats."
              }
            ]
          },
          {
            "name": "functionResponse",
            "type": "object",
            "description": "The result output of a `FunctionCall` that contains a string representing the `FunctionDeclaration.name` and a structured JSON object containing any output from the function is used as context to the model.",
            "children": [
              {
                "name": "willContinue",
                "type": "boolean",
                "description": "Optional. Signals that function call continues, and more responses will be returned, turning the function call into a generator. Is only applicable to NON_BLOCKING function calls, is ignored otherwise. If set to false, future responses will not be considered. It is allowed to return empty `response` with `will_continue=False` to signal that the function call is finished. This may still trigger the model generation. To avoid triggering the generation and finish the function call, additionally set `scheduling` to `SILENT`."
              },
              {
                "name": "response",
                "type": "object",
                "description": "Required. The function response in JSON object format. Callers can use any keys of their choice that fit the function's syntax to return the function output, e.g. \"output\", \"result\", etc. In particular, if the function call failed to execute, the response can have an \"error\" key to return error details to the model. Multimedia can be included by using a subobject containing a single \"$ref\" key whose value is the `inline_data.display_name` of a `FunctionResponsePart` holding the multimedia. See https://ai.google.dev/gemini-api/docs/function-calling#multimodal."
              },
              {
                "name": "parts",
                "type": "array",
                "description": "Optional. Ordered `Parts` that constitute a function response. Parts may have different IANA MIME types."
              },
              {
                "name": "id",
                "type": "string",
                "description": "Optional. The identifier of the function call this response is for. Populated by the client to match the corresponding function call `id`."
              },
              {
                "name": "scheduling",
                "type": "string",
                "description": "Optional. Specifies how the response should be scheduled in the conversation. Only applicable to NON_BLOCKING function calls, is ignored otherwise. Defaults to WHEN_IDLE. (SCHEDULING_UNSPECIFIED, SILENT, WHEN_IDLE, INTERRUPT)"
              },
              {
                "name": "name",
                "type": "string",
                "description": "Required. The name of the function to call. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 128."
              }
            ]
          },
          {
            "name": "executableCode",
            "type": "object",
            "description": "Code generated by the model that is meant to be executed.",
            "children": [
              {
                "name": "id",
                "type": "string",
                "description": "Optional. Unique identifier of the `ExecutableCode` part. The server returns the `CodeExecutionResult` with the matching `id`."
              },
              {
                "name": "code",
                "type": "string",
                "description": "Required. The code to be executed."
              },
              {
                "name": "language",
                "type": "string",
                "description": "Required. Programming language of the `code`. (LANGUAGE_UNSPECIFIED, PYTHON)"
              }
            ]
          },
          {
            "name": "text",
            "type": "string",
            "description": "Inline text."
          },
          {
            "name": "functionCall",
            "type": "object",
            "description": "A predicted `FunctionCall` returned from the model that contains a string representing the `FunctionDeclaration.name` with the arguments and their values.",
            "children": [
              {
                "name": "name",
                "type": "string",
                "description": "Required. The name of the function to call. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 128."
              },
              {
                "name": "args",
                "type": "object",
                "description": "Optional. The function parameters and values in JSON object format."
              },
              {
                "name": "id",
                "type": "string",
                "description": "Optional. Unique identifier of the function call. If populated, the client to execute the `function_call` and return the response with the matching `id`."
              }
            ]
          },
          {
            "name": "toolCall",
            "type": "object",
            "description": "Server-side tool call. This field is populated when the model predicts a tool invocation that should be executed on the server. The client is expected to echo this message back to the API.",
            "children": [
              {
                "name": "args",
                "type": "object",
                "description": "Optional. The tool call arguments. Example: &#123;\"arg1\" : \"value1\", \"arg2\" : \"value2\" , ...&#125;"
              },
              {
                "name": "id",
                "type": "string",
                "description": "Optional. Unique identifier of the tool call. The server returns the tool response with the matching `id`."
              },
              {
                "name": "toolType",
                "type": "string",
                "description": "Required. The type of tool that was called. (TOOL_TYPE_UNSPECIFIED, GOOGLE_SEARCH_WEB, GOOGLE_SEARCH_IMAGE, URL_CONTEXT, GOOGLE_MAPS, FILE_SEARCH)"
              }
            ]
          },
          {
            "name": "toolResponse",
            "type": "object",
            "description": "The output from a server-side `ToolCall` execution. This field is populated by the client with the results of executing the corresponding `ToolCall`.",
            "children": [
              {
                "name": "toolType",
                "type": "string",
                "description": "Required. The type of tool that was called, matching the `tool_type` in the corresponding `ToolCall`. (TOOL_TYPE_UNSPECIFIED, GOOGLE_SEARCH_WEB, GOOGLE_SEARCH_IMAGE, URL_CONTEXT, GOOGLE_MAPS, FILE_SEARCH)"
              },
              {
                "name": "response",
                "type": "object",
                "description": "Optional. The tool response."
              },
              {
                "name": "id",
                "type": "string",
                "description": "Optional. The identifier of the tool call this response is for."
              }
            ]
          },
          {
            "name": "thought",
            "type": "boolean",
            "description": "Optional. Indicates if the part is thought from the model."
          },
          {
            "name": "mediaResolution",
            "type": "object",
            "description": "Optional. Media resolution for the input media.",
            "children": [
              {
                "name": "level",
                "type": "string",
                "description": "The tokenization quality used for given media. for Gemini API support . (MEDIA_RESOLUTION_UNSPECIFIED, MEDIA_RESOLUTION_LOW, MEDIA_RESOLUTION_MEDIUM, MEDIA_RESOLUTION_HIGH, MEDIA_RESOLUTION_ULTRA_HIGH)"
              }
            ]
          },
          {
            "name": "thoughtSignature",
            "type": "string (byte)",
            "description": "Optional. An opaque signature for the thought so it can be reused in subsequent requests."
          },
          {
            "name": "fileData",
            "type": "object",
            "description": "URI based data.",
            "children": [
              {
                "name": "mimeType",
                "type": "string",
                "description": "Optional. The IANA standard MIME type of the source data."
              },
              {
                "name": "fileUri",
                "type": "string",
                "description": "Required. URI."
              }
            ]
          }
        ]
      },
      {
        "name": "role",
        "type": "string",
        "description": "Optional. The producer of the content. Must be either 'user' or 'model'. Useful to set for multi-turn conversations, otherwise can be left blank or unset."
      }
    ]
  },
  {
    "name": "toolConfig",
    "type": "object",
    "description": "Optional. Input only. Immutable. Tool config. This config is shared for all tools.",
    "children": [
      {
        "name": "functionCallingConfig",
        "type": "object",
        "description": "Optional. Function calling config.",
        "children": [
          {
            "name": "mode",
            "type": "string",
            "description": "Optional. Specifies the mode in which function calling should execute. If unspecified, the default value will be set to AUTO. (MODE_UNSPECIFIED, AUTO, ANY, NONE, VALIDATED)"
          },
          {
            "name": "allowedFunctionNames",
            "type": "array",
            "description": "Optional. A set of function names that, when provided, limits the functions the model will call. This should only be set when the Mode is ANY or VALIDATED. Function names should match [FunctionDeclaration.name]. When set, model will predict a function call from only allowed function names."
          }
        ]
      },
      {
        "name": "includeServerSideToolInvocations",
        "type": "boolean",
        "description": "Optional. If true, the API response will include the server-side tool calls and responses within the `Content` message. This allows clients to observe the server's tool interactions."
      },
      {
        "name": "retrievalConfig",
        "type": "object",
        "description": "Optional. Retrieval config.",
        "children": [
          {
            "name": "latLng",
            "type": "object",
            "description": "Optional. The location of the user.",
            "children": [
              {
                "name": "longitude",
                "type": "number (double)",
                "description": "The longitude in degrees. It must be in the range [-180.0, +180.0]."
              },
              {
                "name": "latitude",
                "type": "number (double)",
                "description": "The latitude in degrees. It must be in the range [-90.0, +90.0]."
              }
            ]
          },
          {
            "name": "languageCode",
            "type": "string",
            "description": "Optional. The language code of the user. Language code for content. Use language tags defined by [BCP47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt)."
          }
        ]
      }
    ]
  },
  {
    "name": "tools",
    "type": "array",
    "description": "Optional. Input only. Immutable. A list of `Tools` the model may use to generate the next response",
    "children": [
      {
        "name": "codeExecution",
        "type": "object",
        "description": "Optional. Enables the model to execute code as part of generation."
      },
      {
        "name": "googleSearch",
        "type": "object",
        "description": "Optional. GoogleSearch tool type. Tool to support Google Search in Model. Powered by Google.",
        "children": [
          {
            "name": "timeRangeFilter",
            "type": "object",
            "description": "Optional. Filter search results to a specific time range. If customers set a start time, they must set an end time (and vice versa).",
            "children": [
              {
                "name": "endTime",
                "type": "string (google-datetime)",
                "description": "Optional. Exclusive end of the interval. If specified, a Timestamp matching this interval will have to be before the end."
              },
              {
                "name": "startTime",
                "type": "string (google-datetime)",
                "description": "Optional. Inclusive start of the interval. If specified, a Timestamp matching this interval will have to be the same or after the start."
              }
            ]
          },
          {
            "name": "searchTypes",
            "type": "object",
            "description": "Optional. The set of search types to enable. If not set, web search is enabled by default.",
            "children": [
              {
                "name": "webSearch",
                "type": "object",
                "description": "Optional. Enables web search. Only text results are returned."
              },
              {
                "name": "imageSearch",
                "type": "object",
                "description": "Optional. Enables image search. Image bytes are returned."
              }
            ]
          }
        ]
      },
      {
        "name": "googleMaps",
        "type": "object",
        "description": "Optional. Tool that allows grounding the model's response with geospatial context related to the user's query.",
        "children": [
          {
            "name": "enableWidget",
            "type": "boolean",
            "description": "Optional. Whether to return a widget context token in the GroundingMetadata of the response. Developers can use the widget context token to render a Google Maps widget with geospatial context related to the places that the model references in the response."
          }
        ]
      },
      {
        "name": "computerUse",
        "type": "object",
        "description": "Optional. Tool to support the model interacting directly with the computer. If enabled, it automatically populates computer-use specific Function Declarations.",
        "children": [
          {
            "name": "excludedPredefinedFunctions",
            "type": "array",
            "description": "Optional. By default, predefined functions are included in the final model call. Some of them can be explicitly excluded from being automatically included. This can serve two purposes: 1. Using a more restricted / different action space. 2. Improving the definitions / instructions of predefined functions."
          },
          {
            "name": "enablePromptInjectionDetection",
            "type": "boolean",
            "description": "Optional. Whether enable the prompt injection detection check on computer-use request."
          },
          {
            "name": "environment",
            "type": "string",
            "description": "Required. The environment being operated. (ENVIRONMENT_UNSPECIFIED, ENVIRONMENT_BROWSER, ENVIRONMENT_MOBILE, ENVIRONMENT_DESKTOP)"
          },
          {
            "name": "disabledSafetyPolicies",
            "type": "array",
            "description": "Optional. Disabled safety policies for computer use."
          }
        ]
      },
      {
        "name": "functionDeclarations",
        "type": "array",
        "description": "Optional. A list of `FunctionDeclarations` available to the model that can be used for function calling. The model or system does not execute the function. Instead the defined function may be returned as a FunctionCall with arguments to the client side for execution. The model may decide to call a subset of these functions by populating FunctionCall in the response. The next conversation turn may contain a FunctionResponse with the Content.role \"function\" generation context for the next model turn.",
        "children": [
          {
            "name": "name",
            "type": "string",
            "description": "Required. The name of the function. Must be a-z, A-Z, 0-9, or contain underscores, colons, dots, and dashes, with a maximum length of 128."
          },
          {
            "name": "parameters",
            "type": "object",
            "description": "Optional. Describes the parameters to this function. Reflects the Open API 3.03 Parameter Object string Key: the name of the parameter. Parameter names are case sensitive. Schema Value: the Schema defining the type used for the parameter.",
            "children": [
              {
                "name": "description",
                "type": "string",
                "description": "Optional. A brief description of the parameter. This could contain examples of use. Parameter description may be formatted as Markdown."
              },
              {
                "name": "maximum",
                "type": "number (double)",
                "description": "Optional. Maximum value of the Type.INTEGER and Type.NUMBER"
              },
              {
                "name": "default",
                "type": "string",
                "description": "Optional. Default value of the field. Per JSON Schema, this field is intended for documentation generators and doesn't affect validation. Thus it's included here and ignored so that developers who send schemas with a `default` field don't get unknown-field errors. (arbitrary JSON, projected as a string column)"
              },
              {
                "name": "maxItems",
                "type": "string (int64)",
                "description": "Optional. Maximum number of the elements for Type.ARRAY."
              },
              {
                "name": "properties",
                "type": "object",
                "description": "Optional. Properties of Type.OBJECT."
              },
              {
                "name": "minProperties",
                "type": "string (int64)",
                "description": "Optional. Minimum number of the properties for Type.OBJECT."
              },
              {
                "name": "maxLength",
                "type": "string (int64)",
                "description": "Optional. Maximum length of the Type.STRING"
              },
              {
                "name": "minItems",
                "type": "string (int64)",
                "description": "Optional. Minimum number of the elements for Type.ARRAY."
              },
              {
                "name": "pattern",
                "type": "string",
                "description": "Optional. Pattern of the Type.STRING to restrict a string to a regular expression."
              },
              {
                "name": "title",
                "type": "string",
                "description": "Optional. The title of the schema."
              },
              {
                "name": "nullable",
                "type": "boolean",
                "description": "Optional. Indicates if the value may be null."
              },
              {
                "name": "maxProperties",
                "type": "string (int64)",
                "description": "Optional. Maximum number of the properties for Type.OBJECT."
              },
              {
                "name": "required",
                "type": "array",
                "description": "Optional. Required properties of Type.OBJECT."
              },
              {
                "name": "example",
                "type": "string",
                "description": "Optional. Example of the object. Will only populated when the object is the root. (arbitrary JSON, projected as a string column)"
              },
              {
                "name": "type",
                "type": "string",
                "description": "Required. Data type. (TYPE_UNSPECIFIED, STRING, NUMBER, INTEGER, BOOLEAN, ARRAY, OBJECT, NULL)"
              },
              {
                "name": "anyOf",
                "type": "array",
                "description": "Optional. The value should be validated against any (one or more) of the subschemas in the list."
              },
              {
                "name": "minimum",
                "type": "number (double)",
                "description": "Optional. SCHEMA FIELDS FOR TYPE INTEGER and NUMBER Minimum value of the Type.INTEGER and Type.NUMBER"
              },
              {
                "name": "propertyOrdering",
                "type": "array",
                "description": "Optional. The order of the properties. Not a standard field in open api spec. Used to determine the order of the properties in the response."
              },
              {
                "name": "format",
                "type": "string",
                "description": "Optional. The format of the data. Any value is allowed, but most do not trigger any special functionality."
              },
              {
                "name": "items",
                "type": "object",
                "description": "Optional. Schema of the elements of Type.ARRAY."
              },
              {
                "name": "minLength",
                "type": "string (int64)",
                "description": "Optional. SCHEMA FIELDS FOR TYPE STRING Minimum length of the Type.STRING"
              },
              {
                "name": "enum",
                "type": "array",
                "description": "Optional. Possible values of the element of Type.STRING with enum format. For example we can define an Enum Direction as : &#123;type:STRING, format:enum, enum:[\"EAST\", NORTH\", \"SOUTH\", \"WEST\"]&#125;"
              }
            ]
          },
          {
            "name": "responseJsonSchema",
            "type": "string",
            "description": "Optional. Describes the output from this function in JSON Schema format. The value specified by the schema is the response value of the function. This field is mutually exclusive with `response`. (arbitrary JSON, projected as a string column)"
          },
          {
            "name": "parametersJsonSchema",
            "type": "string",
            "description": "Optional. Describes the parameters to the function in JSON Schema format. The schema must describe an object where the properties are the parameters to the function. For example: ``` &#123; \"type\": \"object\", \"properties\": &#123; \"name\": &#123; \"type\": \"string\" &#125;, \"age\": &#123; \"type\": \"integer\" &#125; &#125;, \"additionalProperties\": false, \"required\": [\"name\", \"age\"], \"propertyOrdering\": [\"name\", \"age\"] &#125; ``` This field is mutually exclusive with `parameters`. (arbitrary JSON, projected as a string column)"
          },
          {
            "name": "response",
            "type": "object",
            "description": "Optional. Describes the output from this function in JSON Schema format. Reflects the Open API 3.03 Response Object. The Schema defines the type used for the response value of the function.",
            "children": [
              {
                "name": "description",
                "type": "string",
                "description": "Optional. A brief description of the parameter. This could contain examples of use. Parameter description may be formatted as Markdown."
              },
              {
                "name": "maximum",
                "type": "number (double)",
                "description": "Optional. Maximum value of the Type.INTEGER and Type.NUMBER"
              },
              {
                "name": "default",
                "type": "string",
                "description": "Optional. Default value of the field. Per JSON Schema, this field is intended for documentation generators and doesn't affect validation. Thus it's included here and ignored so that developers who send schemas with a `default` field don't get unknown-field errors. (arbitrary JSON, projected as a string column)"
              },
              {
                "name": "maxItems",
                "type": "string (int64)",
                "description": "Optional. Maximum number of the elements for Type.ARRAY."
              },
              {
                "name": "properties",
                "type": "object",
                "description": "Optional. Properties of Type.OBJECT."
              },
              {
                "name": "minProperties",
                "type": "string (int64)",
                "description": "Optional. Minimum number of the properties for Type.OBJECT."
              },
              {
                "name": "maxLength",
                "type": "string (int64)",
                "description": "Optional. Maximum length of the Type.STRING"
              },
              {
                "name": "minItems",
                "type": "string (int64)",
                "description": "Optional. Minimum number of the elements for Type.ARRAY."
              },
              {
                "name": "pattern",
                "type": "string",
                "description": "Optional. Pattern of the Type.STRING to restrict a string to a regular expression."
              },
              {
                "name": "title",
                "type": "string",
                "description": "Optional. The title of the schema."
              },
              {
                "name": "nullable",
                "type": "boolean",
                "description": "Optional. Indicates if the value may be null."
              },
              {
                "name": "maxProperties",
                "type": "string (int64)",
                "description": "Optional. Maximum number of the properties for Type.OBJECT."
              },
              {
                "name": "required",
                "type": "array",
                "description": "Optional. Required properties of Type.OBJECT."
              },
              {
                "name": "example",
                "type": "string",
                "description": "Optional. Example of the object. Will only populated when the object is the root. (arbitrary JSON, projected as a string column)"
              },
              {
                "name": "type",
                "type": "string",
                "description": "Required. Data type. (TYPE_UNSPECIFIED, STRING, NUMBER, INTEGER, BOOLEAN, ARRAY, OBJECT, NULL)"
              },
              {
                "name": "anyOf",
                "type": "array",
                "description": "Optional. The value should be validated against any (one or more) of the subschemas in the list."
              },
              {
                "name": "minimum",
                "type": "number (double)",
                "description": "Optional. SCHEMA FIELDS FOR TYPE INTEGER and NUMBER Minimum value of the Type.INTEGER and Type.NUMBER"
              },
              {
                "name": "propertyOrdering",
                "type": "array",
                "description": "Optional. The order of the properties. Not a standard field in open api spec. Used to determine the order of the properties in the response."
              },
              {
                "name": "format",
                "type": "string",
                "description": "Optional. The format of the data. Any value is allowed, but most do not trigger any special functionality."
              },
              {
                "name": "items",
                "type": "object",
                "description": "Optional. Schema of the elements of Type.ARRAY."
              },
              {
                "name": "minLength",
                "type": "string (int64)",
                "description": "Optional. SCHEMA FIELDS FOR TYPE STRING Minimum length of the Type.STRING"
              },
              {
                "name": "enum",
                "type": "array",
                "description": "Optional. Possible values of the element of Type.STRING with enum format. For example we can define an Enum Direction as : &#123;type:STRING, format:enum, enum:[\"EAST\", NORTH\", \"SOUTH\", \"WEST\"]&#125;"
              }
            ]
          },
          {
            "name": "description",
            "type": "string",
            "description": "Required. A brief description of the function."
          },
          {
            "name": "behavior",
            "type": "string",
            "description": "Optional. Specifies the function Behavior. Currently only supported by the BidiGenerateContent method. (UNSPECIFIED, BLOCKING, NON_BLOCKING)"
          }
        ]
      },
      {
        "name": "mcpServers",
        "type": "array",
        "description": "Optional. MCP Servers to connect to.",
        "children": [
          {
            "name": "streamableHttpTransport",
            "type": "object",
            "description": "A transport that can stream HTTP requests and responses.",
            "children": [
              {
                "name": "terminateOnClose",
                "type": "boolean",
                "description": "Whether to close the client session when the transport closes."
              },
              {
                "name": "headers",
                "type": "object",
                "description": "Optional: Fields for authentication headers, timeouts, etc., if needed."
              },
              {
                "name": "timeout",
                "type": "string (google-duration)",
                "description": "HTTP timeout for regular operations."
              },
              {
                "name": "url",
                "type": "string",
                "description": "The full URL for the MCPServer endpoint. Example: \"https://api.example.com/mcp\""
              },
              {
                "name": "sseReadTimeout",
                "type": "string (google-duration)",
                "description": "Timeout for SSE read operations."
              }
            ]
          },
          {
            "name": "name",
            "type": "string",
            "description": "The name of the MCPServer."
          }
        ]
      },
      {
        "name": "urlContext",
        "type": "object",
        "description": "Optional. Tool to support URL context retrieval."
      },
      {
        "name": "googleSearchRetrieval",
        "type": "object",
        "description": "Optional. Retrieval tool that is powered by Google search.",
        "children": [
          {
            "name": "dynamicRetrievalConfig",
            "type": "object",
            "description": "Specifies the dynamic retrieval configuration for the given source.",
            "children": [
              {
                "name": "mode",
                "type": "string",
                "description": "The mode of the predictor to be used in dynamic retrieval. (MODE_UNSPECIFIED, MODE_DYNAMIC)"
              },
              {
                "name": "dynamicThreshold",
                "type": "number (float)",
                "description": "The threshold to be used in dynamic retrieval. If not set, a system default value is used."
              }
            ]
          }
        ]
      },
      {
        "name": "fileSearch",
        "type": "object",
        "description": "Optional. FileSearch tool type. Tool to retrieve knowledge from Semantic Retrieval corpora.",
        "children": [
          {
            "name": "fileSearchStoreNames",
            "type": "array",
            "description": "Required. The names of the file_search_stores to retrieve from. Example: `fileSearchStores/my-file-search-store-123`"
          },
          {
            "name": "topK",
            "type": "integer (int32)",
            "description": "Optional. The number of semantic retrieval chunks to retrieve."
          },
          {
            "name": "metadataFilter",
            "type": "string",
            "description": "Optional. Metadata filter to apply to the semantic retrieval documents and chunks."
          }
        ]
      }
    ]
  },
  {
    "name": "ttl",
    "type": "string (google-duration)",
    "description": "Input only. New TTL for this resource, input only."
  },
  {
    "name": "updateTime",
    "type": "string (google-datetime)",
    "description": "Output only. When the cache entry was last updated in UTC time."
  },
  {
    "name": "usageMetadata",
    "type": "object",
    "description": "Output only. Metadata on the usage of the cached content.",
    "children": [
      {
        "name": "totalTokenCount",
        "type": "integer (int32)",
        "description": "Total number of tokens that the cached content consumes."
      }
    ]
  }
]} />
</TabItem>
<TabItem value="list">

<SchemaTable fields={[
  {
    "name": "name",
    "type": "string",
    "description": "Output only. Identifier. The resource name referring to the cached content. Format: `cachedContents/&#123;id&#125;`"
  },
  {
    "name": "contents",
    "type": "array",
    "description": "Optional. Input only. Immutable. The content to cache.",
    "children": [
      {
        "name": "parts",
        "type": "array",
        "description": "Ordered `Parts` that constitute a single message. Parts may have different MIME types.",
        "children": [
          {
            "name": "codeExecutionResult",
            "type": "object",
            "description": "Result of executing the `ExecutableCode`.",
            "children": [
              {
                "name": "outcome",
                "type": "string",
                "description": "Required. Outcome of the code execution. (OUTCOME_UNSPECIFIED, OUTCOME_OK, OUTCOME_FAILED, OUTCOME_DEADLINE_EXCEEDED)"
              },
              {
                "name": "output",
                "type": "string",
                "description": "Optional. Contains stdout when code execution is successful, stderr or other description otherwise."
              },
              {
                "name": "id",
                "type": "string",
                "description": "Optional. The identifier of the `ExecutableCode` part this result is for. Only populated if the corresponding `ExecutableCode` has an id."
              }
            ]
          },
          {
            "name": "videoMetadata",
            "type": "object",
            "description": "Optional. Video metadata. The metadata should only be specified while the video data is presented in inline_data or file_data.",
            "children": [
              {
                "name": "startOffset",
                "type": "string (google-duration)",
                "description": "Optional. The start offset of the video."
              },
              {
                "name": "endOffset",
                "type": "string (google-duration)",
                "description": "Optional. The end offset of the video."
              },
              {
                "name": "fps",
                "type": "number (double)",
                "description": "Optional. The frame rate of the video sent to the model. If not specified, the default value will be 1.0. The fps range is (0.0, 24.0]."
              }
            ]
          },
          {
            "name": "partMetadata",
            "type": "object",
            "description": "Custom metadata associated with the Part. Agents using genai.Part as content representation may need to keep track of the additional information. For example it can be name of a file/source from which the Part originates or a way to multiplex multiple Part streams."
          },
          {
            "name": "inlineData",
            "type": "object",
            "description": "Inline media bytes.",
            "children": [
              {
                "name": "mimeType",
                "type": "string",
                "description": "The IANA standard MIME type of the source data. Examples of supported types: - Images: image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, image/gif, image/avif - Audio: audio/*, video/audio/s16le, video/audio/wav - Video: video/* - Text: text/plain, text/html, text/css, text/javascript, text/x-typescript, text/csv, text/markdown, text/x-python, text/xml, text/rtf, video/text/timestamp - Applications: application/x-javascript, application/x-typescript, application/x-python-code, application/json, application/x-ipynb+json, application/rtf, application/pdf For additional context, see [Supported file formats](https://ai.google.dev/gemini-api/docs/file-input-methods#supported-content-types). //"
              },
              {
                "name": "data",
                "type": "string (byte)",
                "description": "Raw bytes for media formats."
              }
            ]
          },
          {
            "name": "functionResponse",
            "type": "object",
            "description": "The result output of a `FunctionCall` that contains a string representing the `FunctionDeclaration.name` and a structured JSON object containing any output from the function is used as context to the model.",
            "children": [
              {
                "name": "willContinue",
                "type": "boolean",
                "description": "Optional. Signals that function call continues, and more responses will be returned, turning the function call into a generator. Is only applicable to NON_BLOCKING function calls, is ignored otherwise. If set to false, future responses will not be considered. It is allowed to return empty `response` with `will_continue=False` to signal that the function call is finished. This may still trigger the model generation. To avoid triggering the generation and finish the function call, additionally set `scheduling` to `SILENT`."
              },
              {
                "name": "response",
                "type": "object",
                "description": "Required. The function response in JSON object format. Callers can use any keys of their choice that fit the function's syntax to return the function output, e.g. \"output\", \"result\", etc. In particular, if the function call failed to execute, the response can have an \"error\" key to return error details to the model. Multimedia can be included by using a subobject containing a single \"$ref\" key whose value is the `inline_data.display_name` of a `FunctionResponsePart` holding the multimedia. See https://ai.google.dev/gemini-api/docs/function-calling#multimodal."
              },
              {
                "name": "parts",
                "type": "array",
                "description": "Optional. Ordered `Parts` that constitute a function response. Parts may have different IANA MIME types."
              },
              {
                "name": "id",
                "type": "string",
                "description": "Optional. The identifier of the function call this response is for. Populated by the client to match the corresponding function call `id`."
              },
              {
                "name": "scheduling",
                "type": "string",
                "description": "Optional. Specifies how the response should be scheduled in the conversation. Only applicable to NON_BLOCKING function calls, is ignored otherwise. Defaults to WHEN_IDLE. (SCHEDULING_UNSPECIFIED, SILENT, WHEN_IDLE, INTERRUPT)"
              },
              {
                "name": "name",
                "type": "string",
                "description": "Required. The name of the function to call. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 128."
              }
            ]
          },
          {
            "name": "executableCode",
            "type": "object",
            "description": "Code generated by the model that is meant to be executed.",
            "children": [
              {
                "name": "id",
                "type": "string",
                "description": "Optional. Unique identifier of the `ExecutableCode` part. The server returns the `CodeExecutionResult` with the matching `id`."
              },
              {
                "name": "code",
                "type": "string",
                "description": "Required. The code to be executed."
              },
              {
                "name": "language",
                "type": "string",
                "description": "Required. Programming language of the `code`. (LANGUAGE_UNSPECIFIED, PYTHON)"
              }
            ]
          },
          {
            "name": "text",
            "type": "string",
            "description": "Inline text."
          },
          {
            "name": "functionCall",
            "type": "object",
            "description": "A predicted `FunctionCall` returned from the model that contains a string representing the `FunctionDeclaration.name` with the arguments and their values.",
            "children": [
              {
                "name": "name",
                "type": "string",
                "description": "Required. The name of the function to call. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 128."
              },
              {
                "name": "args",
                "type": "object",
                "description": "Optional. The function parameters and values in JSON object format."
              },
              {
                "name": "id",
                "type": "string",
                "description": "Optional. Unique identifier of the function call. If populated, the client to execute the `function_call` and return the response with the matching `id`."
              }
            ]
          },
          {
            "name": "toolCall",
            "type": "object",
            "description": "Server-side tool call. This field is populated when the model predicts a tool invocation that should be executed on the server. The client is expected to echo this message back to the API.",
            "children": [
              {
                "name": "args",
                "type": "object",
                "description": "Optional. The tool call arguments. Example: &#123;\"arg1\" : \"value1\", \"arg2\" : \"value2\" , ...&#125;"
              },
              {
                "name": "id",
                "type": "string",
                "description": "Optional. Unique identifier of the tool call. The server returns the tool response with the matching `id`."
              },
              {
                "name": "toolType",
                "type": "string",
                "description": "Required. The type of tool that was called. (TOOL_TYPE_UNSPECIFIED, GOOGLE_SEARCH_WEB, GOOGLE_SEARCH_IMAGE, URL_CONTEXT, GOOGLE_MAPS, FILE_SEARCH)"
              }
            ]
          },
          {
            "name": "toolResponse",
            "type": "object",
            "description": "The output from a server-side `ToolCall` execution. This field is populated by the client with the results of executing the corresponding `ToolCall`.",
            "children": [
              {
                "name": "toolType",
                "type": "string",
                "description": "Required. The type of tool that was called, matching the `tool_type` in the corresponding `ToolCall`. (TOOL_TYPE_UNSPECIFIED, GOOGLE_SEARCH_WEB, GOOGLE_SEARCH_IMAGE, URL_CONTEXT, GOOGLE_MAPS, FILE_SEARCH)"
              },
              {
                "name": "response",
                "type": "object",
                "description": "Optional. The tool response."
              },
              {
                "name": "id",
                "type": "string",
                "description": "Optional. The identifier of the tool call this response is for."
              }
            ]
          },
          {
            "name": "thought",
            "type": "boolean",
            "description": "Optional. Indicates if the part is thought from the model."
          },
          {
            "name": "mediaResolution",
            "type": "object",
            "description": "Optional. Media resolution for the input media.",
            "children": [
              {
                "name": "level",
                "type": "string",
                "description": "The tokenization quality used for given media. for Gemini API support . (MEDIA_RESOLUTION_UNSPECIFIED, MEDIA_RESOLUTION_LOW, MEDIA_RESOLUTION_MEDIUM, MEDIA_RESOLUTION_HIGH, MEDIA_RESOLUTION_ULTRA_HIGH)"
              }
            ]
          },
          {
            "name": "thoughtSignature",
            "type": "string (byte)",
            "description": "Optional. An opaque signature for the thought so it can be reused in subsequent requests."
          },
          {
            "name": "fileData",
            "type": "object",
            "description": "URI based data.",
            "children": [
              {
                "name": "mimeType",
                "type": "string",
                "description": "Optional. The IANA standard MIME type of the source data."
              },
              {
                "name": "fileUri",
                "type": "string",
                "description": "Required. URI."
              }
            ]
          }
        ]
      },
      {
        "name": "role",
        "type": "string",
        "description": "Optional. The producer of the content. Must be either 'user' or 'model'. Useful to set for multi-turn conversations, otherwise can be left blank or unset."
      }
    ]
  },
  {
    "name": "createTime",
    "type": "string (google-datetime)",
    "description": "Output only. Creation time of the cache entry."
  },
  {
    "name": "displayName",
    "type": "string",
    "description": "Optional. Immutable. The user-generated meaningful display name of the cached content. Maximum 128 Unicode characters."
  },
  {
    "name": "expireTime",
    "type": "string (google-datetime)",
    "description": "Timestamp in UTC of when this resource is considered expired. This is *always* provided on output, regardless of what was sent on input."
  },
  {
    "name": "model",
    "type": "string",
    "description": "Required. Immutable. The name of the `Model` to use for cached content Format: `models/&#123;model&#125;`"
  },
  {
    "name": "systemInstruction",
    "type": "object",
    "description": "The base structured datatype containing multi-part content of a message. A `Content` includes a `role` field designating the producer of the `Content` and a `parts` field containing multi-part data that contains the content of the message turn.",
    "children": [
      {
        "name": "parts",
        "type": "array",
        "description": "Ordered `Parts` that constitute a single message. Parts may have different MIME types.",
        "children": [
          {
            "name": "codeExecutionResult",
            "type": "object",
            "description": "Result of executing the `ExecutableCode`.",
            "children": [
              {
                "name": "outcome",
                "type": "string",
                "description": "Required. Outcome of the code execution. (OUTCOME_UNSPECIFIED, OUTCOME_OK, OUTCOME_FAILED, OUTCOME_DEADLINE_EXCEEDED)"
              },
              {
                "name": "output",
                "type": "string",
                "description": "Optional. Contains stdout when code execution is successful, stderr or other description otherwise."
              },
              {
                "name": "id",
                "type": "string",
                "description": "Optional. The identifier of the `ExecutableCode` part this result is for. Only populated if the corresponding `ExecutableCode` has an id."
              }
            ]
          },
          {
            "name": "videoMetadata",
            "type": "object",
            "description": "Optional. Video metadata. The metadata should only be specified while the video data is presented in inline_data or file_data.",
            "children": [
              {
                "name": "startOffset",
                "type": "string (google-duration)",
                "description": "Optional. The start offset of the video."
              },
              {
                "name": "endOffset",
                "type": "string (google-duration)",
                "description": "Optional. The end offset of the video."
              },
              {
                "name": "fps",
                "type": "number (double)",
                "description": "Optional. The frame rate of the video sent to the model. If not specified, the default value will be 1.0. The fps range is (0.0, 24.0]."
              }
            ]
          },
          {
            "name": "partMetadata",
            "type": "object",
            "description": "Custom metadata associated with the Part. Agents using genai.Part as content representation may need to keep track of the additional information. For example it can be name of a file/source from which the Part originates or a way to multiplex multiple Part streams."
          },
          {
            "name": "inlineData",
            "type": "object",
            "description": "Inline media bytes.",
            "children": [
              {
                "name": "mimeType",
                "type": "string",
                "description": "The IANA standard MIME type of the source data. Examples of supported types: - Images: image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, image/gif, image/avif - Audio: audio/*, video/audio/s16le, video/audio/wav - Video: video/* - Text: text/plain, text/html, text/css, text/javascript, text/x-typescript, text/csv, text/markdown, text/x-python, text/xml, text/rtf, video/text/timestamp - Applications: application/x-javascript, application/x-typescript, application/x-python-code, application/json, application/x-ipynb+json, application/rtf, application/pdf For additional context, see [Supported file formats](https://ai.google.dev/gemini-api/docs/file-input-methods#supported-content-types). //"
              },
              {
                "name": "data",
                "type": "string (byte)",
                "description": "Raw bytes for media formats."
              }
            ]
          },
          {
            "name": "functionResponse",
            "type": "object",
            "description": "The result output of a `FunctionCall` that contains a string representing the `FunctionDeclaration.name` and a structured JSON object containing any output from the function is used as context to the model.",
            "children": [
              {
                "name": "willContinue",
                "type": "boolean",
                "description": "Optional. Signals that function call continues, and more responses will be returned, turning the function call into a generator. Is only applicable to NON_BLOCKING function calls, is ignored otherwise. If set to false, future responses will not be considered. It is allowed to return empty `response` with `will_continue=False` to signal that the function call is finished. This may still trigger the model generation. To avoid triggering the generation and finish the function call, additionally set `scheduling` to `SILENT`."
              },
              {
                "name": "response",
                "type": "object",
                "description": "Required. The function response in JSON object format. Callers can use any keys of their choice that fit the function's syntax to return the function output, e.g. \"output\", \"result\", etc. In particular, if the function call failed to execute, the response can have an \"error\" key to return error details to the model. Multimedia can be included by using a subobject containing a single \"$ref\" key whose value is the `inline_data.display_name` of a `FunctionResponsePart` holding the multimedia. See https://ai.google.dev/gemini-api/docs/function-calling#multimodal."
              },
              {
                "name": "parts",
                "type": "array",
                "description": "Optional. Ordered `Parts` that constitute a function response. Parts may have different IANA MIME types."
              },
              {
                "name": "id",
                "type": "string",
                "description": "Optional. The identifier of the function call this response is for. Populated by the client to match the corresponding function call `id`."
              },
              {
                "name": "scheduling",
                "type": "string",
                "description": "Optional. Specifies how the response should be scheduled in the conversation. Only applicable to NON_BLOCKING function calls, is ignored otherwise. Defaults to WHEN_IDLE. (SCHEDULING_UNSPECIFIED, SILENT, WHEN_IDLE, INTERRUPT)"
              },
              {
                "name": "name",
                "type": "string",
                "description": "Required. The name of the function to call. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 128."
              }
            ]
          },
          {
            "name": "executableCode",
            "type": "object",
            "description": "Code generated by the model that is meant to be executed.",
            "children": [
              {
                "name": "id",
                "type": "string",
                "description": "Optional. Unique identifier of the `ExecutableCode` part. The server returns the `CodeExecutionResult` with the matching `id`."
              },
              {
                "name": "code",
                "type": "string",
                "description": "Required. The code to be executed."
              },
              {
                "name": "language",
                "type": "string",
                "description": "Required. Programming language of the `code`. (LANGUAGE_UNSPECIFIED, PYTHON)"
              }
            ]
          },
          {
            "name": "text",
            "type": "string",
            "description": "Inline text."
          },
          {
            "name": "functionCall",
            "type": "object",
            "description": "A predicted `FunctionCall` returned from the model that contains a string representing the `FunctionDeclaration.name` with the arguments and their values.",
            "children": [
              {
                "name": "name",
                "type": "string",
                "description": "Required. The name of the function to call. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 128."
              },
              {
                "name": "args",
                "type": "object",
                "description": "Optional. The function parameters and values in JSON object format."
              },
              {
                "name": "id",
                "type": "string",
                "description": "Optional. Unique identifier of the function call. If populated, the client to execute the `function_call` and return the response with the matching `id`."
              }
            ]
          },
          {
            "name": "toolCall",
            "type": "object",
            "description": "Server-side tool call. This field is populated when the model predicts a tool invocation that should be executed on the server. The client is expected to echo this message back to the API.",
            "children": [
              {
                "name": "args",
                "type": "object",
                "description": "Optional. The tool call arguments. Example: &#123;\"arg1\" : \"value1\", \"arg2\" : \"value2\" , ...&#125;"
              },
              {
                "name": "id",
                "type": "string",
                "description": "Optional. Unique identifier of the tool call. The server returns the tool response with the matching `id`."
              },
              {
                "name": "toolType",
                "type": "string",
                "description": "Required. The type of tool that was called. (TOOL_TYPE_UNSPECIFIED, GOOGLE_SEARCH_WEB, GOOGLE_SEARCH_IMAGE, URL_CONTEXT, GOOGLE_MAPS, FILE_SEARCH)"
              }
            ]
          },
          {
            "name": "toolResponse",
            "type": "object",
            "description": "The output from a server-side `ToolCall` execution. This field is populated by the client with the results of executing the corresponding `ToolCall`.",
            "children": [
              {
                "name": "toolType",
                "type": "string",
                "description": "Required. The type of tool that was called, matching the `tool_type` in the corresponding `ToolCall`. (TOOL_TYPE_UNSPECIFIED, GOOGLE_SEARCH_WEB, GOOGLE_SEARCH_IMAGE, URL_CONTEXT, GOOGLE_MAPS, FILE_SEARCH)"
              },
              {
                "name": "response",
                "type": "object",
                "description": "Optional. The tool response."
              },
              {
                "name": "id",
                "type": "string",
                "description": "Optional. The identifier of the tool call this response is for."
              }
            ]
          },
          {
            "name": "thought",
            "type": "boolean",
            "description": "Optional. Indicates if the part is thought from the model."
          },
          {
            "name": "mediaResolution",
            "type": "object",
            "description": "Optional. Media resolution for the input media.",
            "children": [
              {
                "name": "level",
                "type": "string",
                "description": "The tokenization quality used for given media. for Gemini API support . (MEDIA_RESOLUTION_UNSPECIFIED, MEDIA_RESOLUTION_LOW, MEDIA_RESOLUTION_MEDIUM, MEDIA_RESOLUTION_HIGH, MEDIA_RESOLUTION_ULTRA_HIGH)"
              }
            ]
          },
          {
            "name": "thoughtSignature",
            "type": "string (byte)",
            "description": "Optional. An opaque signature for the thought so it can be reused in subsequent requests."
          },
          {
            "name": "fileData",
            "type": "object",
            "description": "URI based data.",
            "children": [
              {
                "name": "mimeType",
                "type": "string",
                "description": "Optional. The IANA standard MIME type of the source data."
              },
              {
                "name": "fileUri",
                "type": "string",
                "description": "Required. URI."
              }
            ]
          }
        ]
      },
      {
        "name": "role",
        "type": "string",
        "description": "Optional. The producer of the content. Must be either 'user' or 'model'. Useful to set for multi-turn conversations, otherwise can be left blank or unset."
      }
    ]
  },
  {
    "name": "toolConfig",
    "type": "object",
    "description": "Optional. Input only. Immutable. Tool config. This config is shared for all tools.",
    "children": [
      {
        "name": "functionCallingConfig",
        "type": "object",
        "description": "Optional. Function calling config.",
        "children": [
          {
            "name": "mode",
            "type": "string",
            "description": "Optional. Specifies the mode in which function calling should execute. If unspecified, the default value will be set to AUTO. (MODE_UNSPECIFIED, AUTO, ANY, NONE, VALIDATED)"
          },
          {
            "name": "allowedFunctionNames",
            "type": "array",
            "description": "Optional. A set of function names that, when provided, limits the functions the model will call. This should only be set when the Mode is ANY or VALIDATED. Function names should match [FunctionDeclaration.name]. When set, model will predict a function call from only allowed function names."
          }
        ]
      },
      {
        "name": "includeServerSideToolInvocations",
        "type": "boolean",
        "description": "Optional. If true, the API response will include the server-side tool calls and responses within the `Content` message. This allows clients to observe the server's tool interactions."
      },
      {
        "name": "retrievalConfig",
        "type": "object",
        "description": "Optional. Retrieval config.",
        "children": [
          {
            "name": "latLng",
            "type": "object",
            "description": "Optional. The location of the user.",
            "children": [
              {
                "name": "longitude",
                "type": "number (double)",
                "description": "The longitude in degrees. It must be in the range [-180.0, +180.0]."
              },
              {
                "name": "latitude",
                "type": "number (double)",
                "description": "The latitude in degrees. It must be in the range [-90.0, +90.0]."
              }
            ]
          },
          {
            "name": "languageCode",
            "type": "string",
            "description": "Optional. The language code of the user. Language code for content. Use language tags defined by [BCP47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt)."
          }
        ]
      }
    ]
  },
  {
    "name": "tools",
    "type": "array",
    "description": "Optional. Input only. Immutable. A list of `Tools` the model may use to generate the next response",
    "children": [
      {
        "name": "codeExecution",
        "type": "object",
        "description": "Optional. Enables the model to execute code as part of generation."
      },
      {
        "name": "googleSearch",
        "type": "object",
        "description": "Optional. GoogleSearch tool type. Tool to support Google Search in Model. Powered by Google.",
        "children": [
          {
            "name": "timeRangeFilter",
            "type": "object",
            "description": "Optional. Filter search results to a specific time range. If customers set a start time, they must set an end time (and vice versa).",
            "children": [
              {
                "name": "endTime",
                "type": "string (google-datetime)",
                "description": "Optional. Exclusive end of the interval. If specified, a Timestamp matching this interval will have to be before the end."
              },
              {
                "name": "startTime",
                "type": "string (google-datetime)",
                "description": "Optional. Inclusive start of the interval. If specified, a Timestamp matching this interval will have to be the same or after the start."
              }
            ]
          },
          {
            "name": "searchTypes",
            "type": "object",
            "description": "Optional. The set of search types to enable. If not set, web search is enabled by default.",
            "children": [
              {
                "name": "webSearch",
                "type": "object",
                "description": "Optional. Enables web search. Only text results are returned."
              },
              {
                "name": "imageSearch",
                "type": "object",
                "description": "Optional. Enables image search. Image bytes are returned."
              }
            ]
          }
        ]
      },
      {
        "name": "googleMaps",
        "type": "object",
        "description": "Optional. Tool that allows grounding the model's response with geospatial context related to the user's query.",
        "children": [
          {
            "name": "enableWidget",
            "type": "boolean",
            "description": "Optional. Whether to return a widget context token in the GroundingMetadata of the response. Developers can use the widget context token to render a Google Maps widget with geospatial context related to the places that the model references in the response."
          }
        ]
      },
      {
        "name": "computerUse",
        "type": "object",
        "description": "Optional. Tool to support the model interacting directly with the computer. If enabled, it automatically populates computer-use specific Function Declarations.",
        "children": [
          {
            "name": "excludedPredefinedFunctions",
            "type": "array",
            "description": "Optional. By default, predefined functions are included in the final model call. Some of them can be explicitly excluded from being automatically included. This can serve two purposes: 1. Using a more restricted / different action space. 2. Improving the definitions / instructions of predefined functions."
          },
          {
            "name": "enablePromptInjectionDetection",
            "type": "boolean",
            "description": "Optional. Whether enable the prompt injection detection check on computer-use request."
          },
          {
            "name": "environment",
            "type": "string",
            "description": "Required. The environment being operated. (ENVIRONMENT_UNSPECIFIED, ENVIRONMENT_BROWSER, ENVIRONMENT_MOBILE, ENVIRONMENT_DESKTOP)"
          },
          {
            "name": "disabledSafetyPolicies",
            "type": "array",
            "description": "Optional. Disabled safety policies for computer use."
          }
        ]
      },
      {
        "name": "functionDeclarations",
        "type": "array",
        "description": "Optional. A list of `FunctionDeclarations` available to the model that can be used for function calling. The model or system does not execute the function. Instead the defined function may be returned as a FunctionCall with arguments to the client side for execution. The model may decide to call a subset of these functions by populating FunctionCall in the response. The next conversation turn may contain a FunctionResponse with the Content.role \"function\" generation context for the next model turn.",
        "children": [
          {
            "name": "name",
            "type": "string",
            "description": "Required. The name of the function. Must be a-z, A-Z, 0-9, or contain underscores, colons, dots, and dashes, with a maximum length of 128."
          },
          {
            "name": "parameters",
            "type": "object",
            "description": "Optional. Describes the parameters to this function. Reflects the Open API 3.03 Parameter Object string Key: the name of the parameter. Parameter names are case sensitive. Schema Value: the Schema defining the type used for the parameter.",
            "children": [
              {
                "name": "description",
                "type": "string",
                "description": "Optional. A brief description of the parameter. This could contain examples of use. Parameter description may be formatted as Markdown."
              },
              {
                "name": "maximum",
                "type": "number (double)",
                "description": "Optional. Maximum value of the Type.INTEGER and Type.NUMBER"
              },
              {
                "name": "default",
                "type": "string",
                "description": "Optional. Default value of the field. Per JSON Schema, this field is intended for documentation generators and doesn't affect validation. Thus it's included here and ignored so that developers who send schemas with a `default` field don't get unknown-field errors. (arbitrary JSON, projected as a string column)"
              },
              {
                "name": "maxItems",
                "type": "string (int64)",
                "description": "Optional. Maximum number of the elements for Type.ARRAY."
              },
              {
                "name": "properties",
                "type": "object",
                "description": "Optional. Properties of Type.OBJECT."
              },
              {
                "name": "minProperties",
                "type": "string (int64)",
                "description": "Optional. Minimum number of the properties for Type.OBJECT."
              },
              {
                "name": "maxLength",
                "type": "string (int64)",
                "description": "Optional. Maximum length of the Type.STRING"
              },
              {
                "name": "minItems",
                "type": "string (int64)",
                "description": "Optional. Minimum number of the elements for Type.ARRAY."
              },
              {
                "name": "pattern",
                "type": "string",
                "description": "Optional. Pattern of the Type.STRING to restrict a string to a regular expression."
              },
              {
                "name": "title",
                "type": "string",
                "description": "Optional. The title of the schema."
              },
              {
                "name": "nullable",
                "type": "boolean",
                "description": "Optional. Indicates if the value may be null."
              },
              {
                "name": "maxProperties",
                "type": "string (int64)",
                "description": "Optional. Maximum number of the properties for Type.OBJECT."
              },
              {
                "name": "required",
                "type": "array",
                "description": "Optional. Required properties of Type.OBJECT."
              },
              {
                "name": "example",
                "type": "string",
                "description": "Optional. Example of the object. Will only populated when the object is the root. (arbitrary JSON, projected as a string column)"
              },
              {
                "name": "type",
                "type": "string",
                "description": "Required. Data type. (TYPE_UNSPECIFIED, STRING, NUMBER, INTEGER, BOOLEAN, ARRAY, OBJECT, NULL)"
              },
              {
                "name": "anyOf",
                "type": "array",
                "description": "Optional. The value should be validated against any (one or more) of the subschemas in the list."
              },
              {
                "name": "minimum",
                "type": "number (double)",
                "description": "Optional. SCHEMA FIELDS FOR TYPE INTEGER and NUMBER Minimum value of the Type.INTEGER and Type.NUMBER"
              },
              {
                "name": "propertyOrdering",
                "type": "array",
                "description": "Optional. The order of the properties. Not a standard field in open api spec. Used to determine the order of the properties in the response."
              },
              {
                "name": "format",
                "type": "string",
                "description": "Optional. The format of the data. Any value is allowed, but most do not trigger any special functionality."
              },
              {
                "name": "items",
                "type": "object",
                "description": "Optional. Schema of the elements of Type.ARRAY."
              },
              {
                "name": "minLength",
                "type": "string (int64)",
                "description": "Optional. SCHEMA FIELDS FOR TYPE STRING Minimum length of the Type.STRING"
              },
              {
                "name": "enum",
                "type": "array",
                "description": "Optional. Possible values of the element of Type.STRING with enum format. For example we can define an Enum Direction as : &#123;type:STRING, format:enum, enum:[\"EAST\", NORTH\", \"SOUTH\", \"WEST\"]&#125;"
              }
            ]
          },
          {
            "name": "responseJsonSchema",
            "type": "string",
            "description": "Optional. Describes the output from this function in JSON Schema format. The value specified by the schema is the response value of the function. This field is mutually exclusive with `response`. (arbitrary JSON, projected as a string column)"
          },
          {
            "name": "parametersJsonSchema",
            "type": "string",
            "description": "Optional. Describes the parameters to the function in JSON Schema format. The schema must describe an object where the properties are the parameters to the function. For example: ``` &#123; \"type\": \"object\", \"properties\": &#123; \"name\": &#123; \"type\": \"string\" &#125;, \"age\": &#123; \"type\": \"integer\" &#125; &#125;, \"additionalProperties\": false, \"required\": [\"name\", \"age\"], \"propertyOrdering\": [\"name\", \"age\"] &#125; ``` This field is mutually exclusive with `parameters`. (arbitrary JSON, projected as a string column)"
          },
          {
            "name": "response",
            "type": "object",
            "description": "Optional. Describes the output from this function in JSON Schema format. Reflects the Open API 3.03 Response Object. The Schema defines the type used for the response value of the function.",
            "children": [
              {
                "name": "description",
                "type": "string",
                "description": "Optional. A brief description of the parameter. This could contain examples of use. Parameter description may be formatted as Markdown."
              },
              {
                "name": "maximum",
                "type": "number (double)",
                "description": "Optional. Maximum value of the Type.INTEGER and Type.NUMBER"
              },
              {
                "name": "default",
                "type": "string",
                "description": "Optional. Default value of the field. Per JSON Schema, this field is intended for documentation generators and doesn't affect validation. Thus it's included here and ignored so that developers who send schemas with a `default` field don't get unknown-field errors. (arbitrary JSON, projected as a string column)"
              },
              {
                "name": "maxItems",
                "type": "string (int64)",
                "description": "Optional. Maximum number of the elements for Type.ARRAY."
              },
              {
                "name": "properties",
                "type": "object",
                "description": "Optional. Properties of Type.OBJECT."
              },
              {
                "name": "minProperties",
                "type": "string (int64)",
                "description": "Optional. Minimum number of the properties for Type.OBJECT."
              },
              {
                "name": "maxLength",
                "type": "string (int64)",
                "description": "Optional. Maximum length of the Type.STRING"
              },
              {
                "name": "minItems",
                "type": "string (int64)",
                "description": "Optional. Minimum number of the elements for Type.ARRAY."
              },
              {
                "name": "pattern",
                "type": "string",
                "description": "Optional. Pattern of the Type.STRING to restrict a string to a regular expression."
              },
              {
                "name": "title",
                "type": "string",
                "description": "Optional. The title of the schema."
              },
              {
                "name": "nullable",
                "type": "boolean",
                "description": "Optional. Indicates if the value may be null."
              },
              {
                "name": "maxProperties",
                "type": "string (int64)",
                "description": "Optional. Maximum number of the properties for Type.OBJECT."
              },
              {
                "name": "required",
                "type": "array",
                "description": "Optional. Required properties of Type.OBJECT."
              },
              {
                "name": "example",
                "type": "string",
                "description": "Optional. Example of the object. Will only populated when the object is the root. (arbitrary JSON, projected as a string column)"
              },
              {
                "name": "type",
                "type": "string",
                "description": "Required. Data type. (TYPE_UNSPECIFIED, STRING, NUMBER, INTEGER, BOOLEAN, ARRAY, OBJECT, NULL)"
              },
              {
                "name": "anyOf",
                "type": "array",
                "description": "Optional. The value should be validated against any (one or more) of the subschemas in the list."
              },
              {
                "name": "minimum",
                "type": "number (double)",
                "description": "Optional. SCHEMA FIELDS FOR TYPE INTEGER and NUMBER Minimum value of the Type.INTEGER and Type.NUMBER"
              },
              {
                "name": "propertyOrdering",
                "type": "array",
                "description": "Optional. The order of the properties. Not a standard field in open api spec. Used to determine the order of the properties in the response."
              },
              {
                "name": "format",
                "type": "string",
                "description": "Optional. The format of the data. Any value is allowed, but most do not trigger any special functionality."
              },
              {
                "name": "items",
                "type": "object",
                "description": "Optional. Schema of the elements of Type.ARRAY."
              },
              {
                "name": "minLength",
                "type": "string (int64)",
                "description": "Optional. SCHEMA FIELDS FOR TYPE STRING Minimum length of the Type.STRING"
              },
              {
                "name": "enum",
                "type": "array",
                "description": "Optional. Possible values of the element of Type.STRING with enum format. For example we can define an Enum Direction as : &#123;type:STRING, format:enum, enum:[\"EAST\", NORTH\", \"SOUTH\", \"WEST\"]&#125;"
              }
            ]
          },
          {
            "name": "description",
            "type": "string",
            "description": "Required. A brief description of the function."
          },
          {
            "name": "behavior",
            "type": "string",
            "description": "Optional. Specifies the function Behavior. Currently only supported by the BidiGenerateContent method. (UNSPECIFIED, BLOCKING, NON_BLOCKING)"
          }
        ]
      },
      {
        "name": "mcpServers",
        "type": "array",
        "description": "Optional. MCP Servers to connect to.",
        "children": [
          {
            "name": "streamableHttpTransport",
            "type": "object",
            "description": "A transport that can stream HTTP requests and responses.",
            "children": [
              {
                "name": "terminateOnClose",
                "type": "boolean",
                "description": "Whether to close the client session when the transport closes."
              },
              {
                "name": "headers",
                "type": "object",
                "description": "Optional: Fields for authentication headers, timeouts, etc., if needed."
              },
              {
                "name": "timeout",
                "type": "string (google-duration)",
                "description": "HTTP timeout for regular operations."
              },
              {
                "name": "url",
                "type": "string",
                "description": "The full URL for the MCPServer endpoint. Example: \"https://api.example.com/mcp\""
              },
              {
                "name": "sseReadTimeout",
                "type": "string (google-duration)",
                "description": "Timeout for SSE read operations."
              }
            ]
          },
          {
            "name": "name",
            "type": "string",
            "description": "The name of the MCPServer."
          }
        ]
      },
      {
        "name": "urlContext",
        "type": "object",
        "description": "Optional. Tool to support URL context retrieval."
      },
      {
        "name": "googleSearchRetrieval",
        "type": "object",
        "description": "Optional. Retrieval tool that is powered by Google search.",
        "children": [
          {
            "name": "dynamicRetrievalConfig",
            "type": "object",
            "description": "Specifies the dynamic retrieval configuration for the given source.",
            "children": [
              {
                "name": "mode",
                "type": "string",
                "description": "The mode of the predictor to be used in dynamic retrieval. (MODE_UNSPECIFIED, MODE_DYNAMIC)"
              },
              {
                "name": "dynamicThreshold",
                "type": "number (float)",
                "description": "The threshold to be used in dynamic retrieval. If not set, a system default value is used."
              }
            ]
          }
        ]
      },
      {
        "name": "fileSearch",
        "type": "object",
        "description": "Optional. FileSearch tool type. Tool to retrieve knowledge from Semantic Retrieval corpora.",
        "children": [
          {
            "name": "fileSearchStoreNames",
            "type": "array",
            "description": "Required. The names of the file_search_stores to retrieve from. Example: `fileSearchStores/my-file-search-store-123`"
          },
          {
            "name": "topK",
            "type": "integer (int32)",
            "description": "Optional. The number of semantic retrieval chunks to retrieve."
          },
          {
            "name": "metadataFilter",
            "type": "string",
            "description": "Optional. Metadata filter to apply to the semantic retrieval documents and chunks."
          }
        ]
      }
    ]
  },
  {
    "name": "ttl",
    "type": "string (google-duration)",
    "description": "Input only. New TTL for this resource, input only."
  },
  {
    "name": "updateTime",
    "type": "string (google-datetime)",
    "description": "Output only. When the cache entry was last updated in UTC time."
  },
  {
    "name": "usageMetadata",
    "type": "object",
    "description": "Output only. Metadata on the usage of the cached content.",
    "children": [
      {
        "name": "totalTokenCount",
        "type": "integer (int32)",
        "description": "Total number of tokens that the cached content consumes."
      }
    ]
  }
]} />
</TabItem>
</Tabs>

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
    <td><a href="#get"><CopyableCode code="get" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-cachedContentsId"><code>cachedContentsId</code></a></td>
    <td></td>
    <td>Reads CachedContent resource.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td></td>
    <td>Lists CachedContents.</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td></td>
    <td></td>
    <td>Creates CachedContent resource.</td>
</tr>
<tr>
    <td><a href="#patch"><CopyableCode code="patch" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td><a href="#parameter-cachedContentsId"><code>cachedContentsId</code></a></td>
    <td><a href="#parameter-updateMask"><code>updateMask</code></a></td>
    <td>Updates CachedContent resource (only expiration is updatable).</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-cachedContentsId"><code>cachedContentsId</code></a></td>
    <td></td>
    <td>Deletes CachedContent resource.</td>
</tr>
</tbody>
</table>

## Parameters

Parameters can be passed in the `WHERE` clause of a query. Check the [Methods](#methods) section to see which parameters are required or optional for each operation.

<table>
<thead>
    <tr>
    <th>Name</th>
    <th>Datatype</th>
    <th>Description</th>
    </tr>
</thead>
<tbody>
<tr id="parameter-cachedContentsId">
    <td><CopyableCode code="cachedContentsId" /></td>
    <td><code>string</code></td>
    <td></td>
</tr>
<tr id="parameter-updateMask">
    <td><CopyableCode code="updateMask" /></td>
    <td><code>string (google-fieldmask)</code></td>
    <td>The list of fields to update.</td>
</tr>
</tbody>
</table>

## `SELECT` examples

<Tabs
    defaultValue="get"
    values={[
        { label: 'get', value: 'get' },
        { label: 'list', value: 'list' }
    ]}
>
<TabItem value="get">

Reads CachedContent resource.

```sql
SELECT
name,
contents,
createTime,
displayName,
expireTime,
model,
systemInstruction,
toolConfig,
tools,
ttl,
updateTime,
usageMetadata
FROM gemini.cached_contents.cached_contents
WHERE cachedContentsId = '{{ cachedContentsId }}' -- required
;
```
</TabItem>
<TabItem value="list">

Lists CachedContents.

```sql
SELECT
name,
contents,
createTime,
displayName,
expireTime,
model,
systemInstruction,
toolConfig,
tools,
ttl,
updateTime,
usageMetadata
FROM gemini.cached_contents.cached_contents
;
```
</TabItem>
</Tabs>


## `INSERT` examples

<Tabs
    defaultValue="create"
    values={[
        { label: 'create', value: 'create' },
        { label: 'Manifest', value: 'manifest' }
    ]}
>
<TabItem value="create">

Creates CachedContent resource.

```sql
INSERT INTO gemini.cached_contents.cached_contents (
toolConfig,
model,
contents,
ttl,
systemInstruction,
tools,
expireTime,
displayName
)
SELECT 
'{{ toolConfig }}',
'{{ model }}',
'{{ contents }}',
'{{ ttl }}',
'{{ systemInstruction }}',
'{{ tools }}',
'{{ expireTime }}',
'{{ displayName }}'
RETURNING
name,
contents,
createTime,
displayName,
expireTime,
model,
systemInstruction,
toolConfig,
tools,
ttl,
updateTime,
usageMetadata
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: cached_contents
  props:
    - name: toolConfig
      description: |
        Optional. Input only. Immutable. Tool config. This config is shared for all tools.
      value:
        functionCallingConfig:
          mode: "{{ mode }}"
          allowedFunctionNames:
            - "{{ allowedFunctionNames }}"
        includeServerSideToolInvocations: {{ includeServerSideToolInvocations }}
        retrievalConfig:
          latLng:
            longitude: {{ longitude }}
            latitude: {{ latitude }}
          languageCode: "{{ languageCode }}"
    - name: model
      value: "{{ model }}"
      description: |
        Required. Immutable. The name of the \`Model\` to use for cached content Format: \`models/{model}\`
    - name: contents
      description: |
        Optional. Input only. Immutable. The content to cache.
      value:
        - parts: "{{ parts }}"
          role: "{{ role }}"
    - name: ttl
      value: "{{ ttl }}"
      description: |
        Input only. New TTL for this resource, input only.
    - name: systemInstruction
      description: |
        The base structured datatype containing multi-part content of a message. A \`Content\` includes a \`role\` field designating the producer of the \`Content\` and a \`parts\` field containing multi-part data that contains the content of the message turn.
      value:
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
    - name: tools
      description: |
        Optional. Input only. Immutable. A list of \`Tools\` the model may use to generate the next response
      value:
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
    - name: expireTime
      value: "{{ expireTime }}"
      description: |
        Timestamp in UTC of when this resource is considered expired. This is *always* provided on output, regardless of what was sent on input.
    - name: displayName
      value: "{{ displayName }}"
      description: |
        Optional. Immutable. The user-generated meaningful display name of the cached content. Maximum 128 Unicode characters.
`}</CodeBlock>

</TabItem>
</Tabs>


## `UPDATE` examples

<Tabs
    defaultValue="patch"
    values={[
        { label: 'patch', value: 'patch' }
    ]}
>
<TabItem value="patch">

Updates CachedContent resource (only expiration is updatable).

```sql
UPDATE gemini.cached_contents.cached_contents
SET 
toolConfig = '{{ toolConfig }}',
model = '{{ model }}',
contents = '{{ contents }}',
ttl = '{{ ttl }}',
systemInstruction = '{{ systemInstruction }}',
tools = '{{ tools }}',
expireTime = '{{ expireTime }}',
displayName = '{{ displayName }}'
WHERE 
cachedContentsId = '{{ cachedContentsId }}' --required
WHERE updateMask = '{{ updateMask}}'
RETURNING
name,
contents,
createTime,
displayName,
expireTime,
model,
systemInstruction,
toolConfig,
tools,
ttl,
updateTime,
usageMetadata;
```
</TabItem>
</Tabs>


## `DELETE` examples

<Tabs
    defaultValue="delete"
    values={[
        { label: 'delete', value: 'delete' }
    ]}
>
<TabItem value="delete">

Deletes CachedContent resource.

```sql
DELETE FROM gemini.cached_contents.cached_contents
WHERE cachedContentsId = '{{ cachedContentsId }}' --required
;
```
</TabItem>
</Tabs>
