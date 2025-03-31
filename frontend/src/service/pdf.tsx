import { jsPDF } from "jspdf";

// ฟังก์ชันสร้าง PDF
export const generatePDF = async () => {
    // สร้าง PDF
    const doc = new jsPDF();
    
    // เพิ่มฟอนต์ไทย
    doc.addFont("src/assets/Maehongson.ttf", "Maehongson", "normal");
    
    // ตั้งค่าฟอนต์ไทย
    doc.setFont("Maehongson");
    
    // หัวข้อเอกสาร
    doc.setFontSize(18);
    doc.text("TEST PDF", 105, 20, { align: "center" });

    // เนื้อหาภาษาไทย
    doc.setFontSize(12);
    let yPosition = 40;
    const thaiLabels = [
        "ประสิทธิภาพในการปฏิบัติงานที่ได้รับมอบ", 
        "การจัดการ และการวางแผนงาน", 
        "การจัดสรรเวลา การบริหารเวลา",
        "ประหยัดค่าใช้จ่าย เช่น ค่าอาหาร ค่าเดินทาง", 
        "การได้เรียนรู้การใช้เทคโนโลยีในการทำงาน",
        "ภาวะความกดดันในการทำงาน สิ่งแวดล้อม", 
        "เครื่องมือ วัสดุอุปกรณ์ความสะดวกในการทำงาน",
        "การสนับสนุนจากส่วนงานที่เกี่ยวข้อง", 
        "ความสุขหรือสนุก ในการทำงาน", 
        "ความพึงพอใจในการร่วมโครงการ AWAT"
    ];

    thaiLabels.forEach((label, index) => {
        doc.text(`${index + 1}. ${label}`, 20, yPosition);
        yPosition += 10;
    });

    // สร้าง URL และเปิดในแท็บใหม่
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
};