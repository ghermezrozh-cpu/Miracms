// studio-eramtv/components/QRCodeInput.tsx
import React, {useState, useEffect} from 'react'
import {Stack, Button, Card, Text, Flex} from '@sanity/ui'

export default function QRCodeInput(props: any) {
  const {value, onChange, document} = props
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  
  // Debug: چاپ اطلاعات
  console.log('🔍 QR Debug:', {
    document: document,
    slug: document?.slug,
    trackingId: document?.slug?.current,
    value: value
  })
  
  const trackingId = document?.slug?.current
  
  useEffect(() => {
    if (trackingId) {
      const siteUrl = 'https://eramtv.com' // آدرس سایت خود را وارد کنید
      const articleUrl = `${siteUrl}/${trackingId}`
      setPreviewUrl(articleUrl)
      
      if (value?.enabled && (!value?.url || value.url !== articleUrl)) {
        onChange({
          ...value,
          url: articleUrl
        })
      }
    }
  }, [trackingId, value, onChange])
  
  const generateQRCode = async () => {
    if (!trackingId) {
      alert('ابتدا مقاله را ذخیره کنید تا کد رهگیری تولید شود.')
      return
    }
    
    if (!previewUrl) {
      alert('URL مقاله تولید نشده است.')
      return
    }
    
    setIsGenerating(true)
    
    try {
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(previewUrl)}`
      
      console.log('🔗 QR API URL:', qrApiUrl)
      
      const response = await fetch(qrApiUrl)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const blob = await response.blob()
      
      const file = new File([blob], `qr-${trackingId}.png`, { type: 'image/png' })
      
      const imageAsset = await props.client.assets.upload('image', file, {
        filename: `qr-${trackingId}.png`
      })
      
      console.log('✅ Image Asset:', imageAsset)
      
      onChange({
        ...value,
        enabled: true,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id
          }
        },
        url: previewUrl,
        generatedAt: new Date().toISOString()
      })
      
      alert('QR Code با موفقیت تولید شد!')
      
    } catch (error) {
      console.error('❌ خطا در تولید QR Code:', error)
      alert(`خطا در تولید QR Code: ${error}`)
    } finally {
      setIsGenerating(false)
    }
  }
  
  // اگر slug وجود ندارد، پیام راهنمایی نشان بده
  const canGenerate = trackingId && trackingId.length === 12
  
  return (
    <Stack space={4}>
      <Card padding={4} radius={2} shadow={1}>
        <Stack space={3}>
          {/* فعال/غیرفعال */}
          <Flex align="center" gap={2}>
            <input
              type="checkbox"
              checked={value?.enabled || false}
              onChange={(e) => onChange({
                ...value,
                enabled: e.target.checked
              })}
            />
            <Text weight="semibold">فعال کردن QR Code</Text>
          </Flex>
          
          {/* Debug Info */}
          <Card padding={2} tone="caution" radius={2}>
            <Text size={1}>
              🔍 Debug: کد رهگیری = {trackingId || 'ندارد'} | وضعیت = {canGenerate ? 'آماده' : 'غیر آماده'}
            </Text>
          </Card>
          
          {value?.enabled && (
            <>
              {/* نمایش URL */}
              {previewUrl && (
                <Card padding={3} tone="primary" radius={2}>
                  <Stack space={2}>
                    <Text size={1} weight="semibold">URL مقاله:</Text>
                    <Text size={1} style={{fontFamily: 'monospace'}}>{previewUrl}</Text>
                  </Stack>
                </Card>
              )}
              
              {/* دکمه تولید */}
              <Button
                onClick={generateQRCode}
                disabled={isGenerating || !canGenerate}
                tone={canGenerate ? "primary" : "default"}
                text={
                  isGenerating ? 'در حال تولید...' : 
                  canGenerate ? 'تولید QR Code' : 
                  'ابتدا مقاله را ذخیره کنید'
                }
                loading={isGenerating}
              />
              
              {!canGenerate && (
                <Card padding={3} tone="caution" radius={2}>
                  <Text size={1}>
                    ⚠️ ابتدا مقاله را ذخیره کنید تا کد رهگیری 12 رقمی تولید شود.
                    {trackingId && <><br/>کد فعلی: {trackingId} (طول: {trackingId.length})</>}
                  </Text>
                </Card>
              )}
              
              {/* پیش‌نمایش */}
              {value?.image && (
                <Card padding={3} radius={2}>
                  <Stack space={2}>
                    <Text weight="semibold">پیش‌نمایش QR Code:</Text>
                    <div style={{textAlign: 'center'}}>
                      <img 
                        src={`https://cdn.sanity.io/images/${props.client.config().projectId}/${props.client.config().dataset}/${value.image.asset._ref.replace('image-', '').replace('-png', '.png')}`}
                        alt="QR Code Preview"
                        style={{maxWidth: '200px', border: '1px solid #ddd', borderRadius: '4px'}}
                      />
                    </div>
                  </Stack>
                </Card>
              )}
              
              {/* تاریخ تولید */}
              {value?.generatedAt && (
                <Text size={1} muted>
                  تولید شده در: {new Date(value.generatedAt).toLocaleDateString('fa-IR')}
                </Text>
              )}
            </>
          )}
        </Stack>
      </Card>
    </Stack>
  )
}