using System.ComponentModel.DataAnnotations;

namespace Backend_API.Models
{
    public class Batch
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } // e.g., "CS-402 Undergraduate"
    }

    public class Hall
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } // e.g., "Hall B2"
    }

    public class Lecture
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string? Description { get; set; }
        public string LecturerName { get; set; }

        public DateTime Date { get; set; }
        public string StartTime { get; set; } // Stored as string "09:00" for simplicity
        public string EndTime { get; set; }

        public int BatchId { get; set; }
        public Batch? Batch { get; set; }

        public int HallId { get; set; }
        public Hall? Hall { get; set; }

        public string Status { get; set; } = "Scheduled"; // Scheduled, Pending, Canceled
    }
}
