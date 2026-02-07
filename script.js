document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const imageUpload = document.getElementById('image-upload');
    const previewImage = document.getElementById('preview-image');
    const previewContainer = document.getElementById('preview-container');
    const borderWidth = document.getElementById('border-width');
    const borderWidthValue = document.getElementById('border-width-value');
    const borderColor = document.getElementById('border-color');
    const enableGradient = document.getElementById('enable-gradient');
    const gradientControls = document.getElementById('gradient-controls');
    const gradientColor = document.getElementById('gradient-color');
    const gradientDirection = document.getElementById('gradient-direction');
    const downloadBtn = document.getElementById('download-btn');
    
    let currentImage = null;
    
    // 图片上传处理
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                currentImage = e.target.result;
                updatePreview();
                downloadBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 边框宽度变化处理
    borderWidth.addEventListener('input', function() {
        borderWidthValue.textContent = this.value;
        updatePreview();
    });
    
    // 边框颜色变化处理
    borderColor.addEventListener('input', updatePreview);
    
    // 启用/禁用过渡色
    enableGradient.addEventListener('change', function() {
        if (this.checked) {
            gradientControls.style.display = 'block';
        } else {
            gradientControls.style.display = 'none';
        }
        updatePreview();
    });
    
    // 过渡色变化处理
    gradientColor.addEventListener('input', updatePreview);
    gradientDirection.addEventListener('change', updatePreview);
    
    // 更新预览
    function updatePreview() {
        if (!currentImage) return;
        
        const width = borderWidth.value;
        const color = borderColor.value;
        const useGradient = enableGradient.checked;
        const gradColor = gradientColor.value;
        const gradDirection = gradientDirection.value;
        
        if (useGradient) {
            previewContainer.style.background = `linear-gradient(${gradDirection}, ${color}, ${gradColor})`;
        } else {
            previewContainer.style.background = color;
        }
        
        previewContainer.style.padding = `${width}px`;
    }
    
    // 下载功能
    downloadBtn.addEventListener('click', function() {
        if (!currentImage) return;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const img = new Image();
        img.onload = function() {
            const borderWidthVal = parseInt(borderWidth.value);
            const canvasWidth = img.width + borderWidthVal * 2;
            const canvasHeight = img.height + borderWidthVal * 2;
            
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            
            // 绘制边框
            if (enableGradient.checked) {
                const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
                
                // 根据方向设置渐变
                const direction = gradientDirection.value;
                if (direction === 'to right') {
                    gradient.addColorStop(0, borderColor.value);
                    gradient.addColorStop(1, gradientColor.value);
                } else if (direction === 'to bottom') {
                    gradient.addColorStop(0, borderColor.value);
                    gradient.addColorStop(1, gradientColor.value);
                } else if (direction === 'to bottom right') {
                    gradient.addColorStop(0, borderColor.value);
                    gradient.addColorStop(1, gradientColor.value);
                } else if (direction === 'to top right') {
                    gradient.addColorStop(0, borderColor.value);
                    gradient.addColorStop(1, gradientColor.value);
                }
                
                ctx.fillStyle = gradient;
            } else {
                ctx.fillStyle = borderColor.value;
            }
            
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            // 绘制图片
            ctx.drawImage(img, borderWidthVal, borderWidthVal);
            
            // 下载图片
            const link = document.createElement('a');
            link.download = 'bordered-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
        
        img.src = currentImage;
    });
});