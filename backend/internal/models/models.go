package models

import (
	"encoding/json"
	"time"
)

type Order struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Email       string    `json:"email"`
	Company     string    `json:"company"`
	Service     string    `json:"service"`
	Budget      string    `json:"budget"`
	Message     string    `json:"message"`
	Attachments []string  `json:"attachments"`
	MediaType   string    `json:"mediaType"`
	Lang        string    `json:"lang"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"createdAt"`
}

type Article struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	URL         string    `json:"url"`
	Summary     string    `json:"summary"`
	Category    string    `json:"category"`
	Status      string    `json:"status"`
	PublishedAt time.Time `json:"publishedAt"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type Contact struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Phone     string    `json:"phone"`
	Subject   string    `json:"subject"`
	Message   string    `json:"message"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"createdAt"`
}

// ContentItem preserves the type-specific fields used by publications, books,
// and journals while presenting the Parse object ID as "id" to API clients.
type ContentItem struct {
	ID     string                 `json:"-"`
	Fields map[string]interface{} `json:"-"`
}

func (c ContentItem) MarshalJSON() ([]byte, error) {
	fields := make(map[string]interface{}, len(c.Fields)+1)
	for key, value := range c.Fields {
		fields[key] = value
	}
	if c.ID != "" {
		fields["id"] = c.ID
	}
	return json.Marshal(fields)
}

func (c *ContentItem) UnmarshalJSON(data []byte) error {
	var fields map[string]interface{}
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	if id, ok := fields["id"].(string); ok {
		c.ID = id
	} else if id, ok := fields["objectId"].(string); ok {
		c.ID = id
	}
	delete(fields, "id")
	delete(fields, "objectId")
	c.Fields = fields
	return nil
}

type WorkExperience struct {
	Title   string   `json:"title"`
	Company string   `json:"company"`
	Period  string   `json:"period"`
	Details []string `json:"details"`
	Tags    []string `json:"tags"`
}

type Project struct {
	Title          string   `json:"title"`
	Period         string   `json:"period"`
	AssociatedWith string   `json:"associatedWith"`
	URL            string   `json:"url"`
	Details        []string `json:"details"`
}

type Certification struct {
	Title        string   `json:"title"`
	Organization string   `json:"organization"`
	IssueDate    string   `json:"issueDate"`
	ExpiryDate   string   `json:"expiryDate"`
	CredentialID string   `json:"credentialId"`
	Skills       []string `json:"skills"`
	Description  string   `json:"description"`
	Slug         string   `json:"slug"`
	PDF          string   `json:"pdf"`
}

type Education struct {
	Degree      string   `json:"degree"`
	Institution string   `json:"institution"`
	Date        string   `json:"date"`
	Skills      []string `json:"skills"`
	Description string   `json:"description"`
}

type Volunteering struct {
	Title        string `json:"title"`
	Organization string `json:"organization"`
	Period       string `json:"period"`
	Category     string `json:"category"`
	Description  string `json:"description"`
}

type CVData struct {
	Name           string            `json:"name"`
	Title          string            `json:"title"`
	Location       string            `json:"location"`
	Age            string            `json:"age"`
	BirthDate      string            `json:"birthDate"`
	Nationality    string            `json:"nationality"`
	Address        string            `json:"address"`
	Phone          string            `json:"phone"`
	Email          string            `json:"email"`
	Profile        []string          `json:"profile"`
	WorkExperience []WorkExperience  `json:"workExperience"`
	Skills         []string          `json:"skills"`
	Projects       []Project         `json:"projects"`
	Education      []Education       `json:"education"`
	Certifications []Certification   `json:"certifications"`
	Volunteering   []Volunteering    `json:"volunteering"`
	Languages      []string          `json:"languages"`
	Hobbies        []string          `json:"hobbies"`
	Contact        map[string]string `json:"contact"`
	Links          []string          `json:"links"`
}

type Store struct {
	CV       CVData    `json:"cv"`
	Articles []Article `json:"articles"`
}

type User struct {
	ID       string `json:"id"`
	Email    string `json:"email"`
	Name     string `json:"name"`
	Role     string `json:"role"`
	Username string `json:"username"`
}
