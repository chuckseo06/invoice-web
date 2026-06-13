"use server"

import {
  getInvoices as _getQuotes,
  getInvoiceByQuoteId as _getQuoteByQuoteId,
  createInvoice as _createQuote,
  updateInvoiceStatus as _updateQuoteStatus,
  deleteInvoice as _deleteQuote,
} from "./notion-invoice"
import type { CreateInvoiceInput, QuoteStatus, Invoice } from "@/types"

// 에러 처리 래퍼 함수들

export async function getQuotes(): Promise<Invoice[]> {
  try {
    return await _getQuotes()
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "견적서 목록 조회 실패"
    console.error("getQuotes 에러:", message)
    throw new Error(message)
  }
}

export async function getQuoteByQuoteId(quoteId: string): Promise<Invoice | null> {
  try {
    return await _getQuoteByQuoteId(quoteId)
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : `견적서 '${quoteId}' 조회 실패`
    console.error("getQuoteByQuoteId 에러:", message)
    throw new Error(message)
  }
}

export async function createQuote(
  data: CreateInvoiceInput
): Promise<{ success: boolean; data?: Invoice; error?: string }> {
  try {
    const result = await _createQuote(data)
    return { success: true, data: result }
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "견적서 생성 중 오류가 발생했습니다"
    console.error("createQuote 에러:", errorMessage)
    return {
      success: false,
      error: errorMessage,
    }
  }
}

export async function updateQuoteStatus(
  pageId: string,
  status: QuoteStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    await _updateQuoteStatus(pageId, status)
    return { success: true }
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "상태 변경 중 오류가 발생했습니다"
    console.error("updateQuoteStatus 에러:", errorMessage)
    return {
      success: false,
      error: errorMessage,
    }
  }
}

export async function deleteQuote(
  pageId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await _deleteQuote(pageId)
    return { success: true }
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "견적서 삭제 중 오류가 발생했습니다"
    console.error("deleteQuote 에러:", errorMessage)
    return {
      success: false,
      error: errorMessage,
    }
  }
}
