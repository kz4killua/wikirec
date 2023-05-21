import os
import re

key = os.environ['AZURE_DOCUMENT_SUMMARIZER_KEY_1']
endpoint = os.environ['AZURE_DOCUMENT_SUMMARIZER_ENDPOINT']

import mwparserfromhell
from azure.ai.textanalytics import TextAnalyticsClient, ExtractSummaryAction, AbstractSummaryAction
from azure.core.credentials import AzureKeyCredential


def authenticate_client():
    # Authenticate the client using your key and endpoint
    ta_credential = AzureKeyCredential(key)
    text_analytics_client = TextAnalyticsClient(
            endpoint=endpoint, 
            credential=ta_credential)
    return text_analytics_client


client = authenticate_client()


def summarize(page):

    wikitext = page['source']
    wikicode = mwparserfromhell.parse(wikitext)

    # Get the sections we are interested in
    sections = wikicode.get_sections()
    sections = sections[:3]
    
    # Get each section's text
    sections = [str(section) for section in sections]

    # Combine the texts
    document = "\n\n".join(sections)

    # Remove strange characters
    for character in "[]":
        document = document.replace(character, '')

    document = re.sub(r"\{\{[\s\S]*?\}\}", "", document)

    document = re.sub(r"('{2,})", "", document)

    document = re.sub(r"==.*?==", "", document)

    # Summarize
    summary = extractive_summary([document])

    return summary[0]


def extractive_summary(documents):

    poller = client.begin_analyze_actions(
        documents,
        actions=[
            ExtractSummaryAction(max_sentence_count=12),
        ],
    )

    summaries = []

    for result in poller.result():
        extract_summary_result = result[0]
        if extract_summary_result.is_error:
            print("...Is an error with code '{}' and message '{}'".format(
                extract_summary_result.code, extract_summary_result.message
            ))
            raise Exception
        else:
            summaries.append(
                " ".join([sentence.text for sentence in extract_summary_result.sentences])
            )

    return summaries


def abstractive_summary(documents):

    poller = client.begin_analyze_actions(
        documents,
        actions=[
            AbstractSummaryAction(sentence_count=10),
        ],
    )

    summaries = [result[0] for result in poller.result()]

    return summaries

